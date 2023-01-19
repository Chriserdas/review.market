import React, { useEffect, useState,useRef, useContext } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap,Tooltip } from "react-leaflet";
import L from 'leaflet'
import axios from "axios";
import ShopClickedContext from "../User/ShopClickedContext";
import { LatLng } from 'leaflet';
import SupermarketContext from "../User/SupermarketContext";
import SupermarketsCon from "../User/SupermarketsCon";
export default function MapCurrentLocation(props) {

    const [data,setData] = useState(null);
    const {showProduct,setShowProduct} = useContext(ShopClickedContext);
    const [currentLocation,setCurrentLocation] = useState(null);

    const {clickedSupermarket,setClickedSupermarket} = useContext(SupermarketContext);
    const {supermarkets,setSupermarkets} = useContext(SupermarketsCon);
    useEffect(() => {
        if(props.isClicked === "Current Location"){
            //setShowProduct({show:false})
            axios.get("http://localhost:5000/api/getCurrentLocation").then((response) => {
                setData(response.data);
            });
        }

        if(props.isClicked === "Search"){
            setShowProduct({show:false})
            axios.get('http://localhost:5000/api/getSupermarket')
            .then((response) => {
                setSupermarkets(response.data);
            })
        }
    },[props.isClicked]);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            setCurrentLocation(new LatLng(position.coords.latitude, position.coords.longitude))
        });
    })

    
    const offerIcon = new L.icon({
        iconUrl: require('./../../images/offer_marker.png'),
        iconSize: [55,55],
    });

    const supermarketIcon = new L.icon({
        iconUrl: require('./../../images/default_marker.png'),
        iconSize: [40,40],
    })
    
    return (
        
        <MapContainer
            center={[38.246639, 21.734573]}
            zoom={13}
            scrollWheelZoom
            zoomControl= {false}
            attributionControl= {false}
            animate={true}
            style={{ width: "100%", height: "100%" }}
        >
            <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            <LocationMarker/>

            {data !== null ? (
                data.map(result=>(
                    <Marker 
                        key={result._id}
                        position={result.supermarkets[0].geometry.coordinates.reverse()} 
                        icon={offerIcon}
                        eventHandlers={{
                            click: (e) => {
                                
                                setShowProduct({
                                    show:true,
                                    offers:data.filter(offer=> offer.supermarkets[0]._id === result.supermarkets[0]._id),
                                    super_name:result.supermarkets[0].properties.name || result.supermarkets[0].properties.shop,
                                    isNear:true,//currentLocation.distanceTo(result.supermarkets[0].geometry.coordinates.reverse()) <50 ? true : false,
                                    supermarket_id:result.supermarkets[0]._id
                                })
                                
                            },
                        }}
                    >
                    
                        <Tooltip>
                            {result.supermarkets[0].properties.name || result.properties.shop}
                        </Tooltip>
                        
                    </Marker>

                ))
            ):""}

            {supermarkets!==null && props.isClicked === "Search" ?
                (
                    supermarkets.map(supermarket=>(
                        <Marker
                            key = {supermarkets._id}
                            position={supermarket.geometry.coordinates.reverse()}
                            icon={supermarketIcon}

                        >
                            <Tooltip>
                                {supermarket.properties.name || supermarket.properties.shop} 
                            </Tooltip>
                        </Marker>
                    ))
                )
                :""
            }
        </MapContainer>
    );
}


function LocationMarker(props) {
  const [position, setPosition] = useState(null);

  const map = useMap();

    const currentLocationIcon = new L.icon({
        iconUrl:require('./../../images/current_location_marker.png'),
        iconSize: [40,40],
    })
  useEffect(() => {
    map.locate().on("locationfound", function (e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    });
  }, [map]);

  return position === null ? null : (
    <Marker icon={currentLocationIcon} position={position}>
      <Tooltip>
        Your current location. <br />
      </Tooltip>
    </Marker>
  );
}