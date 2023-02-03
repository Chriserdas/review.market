import React, { useEffect, useState,useRef, useContext } from "react";
import { MapContainer, TileLayer, Marker, Popup,Circle, useMap,Tooltip } from "react-leaflet";
import L from 'leaflet'
import axios from "axios";
import ShopClickedContext from "../User/ShopClickedContext";
import { LatLng } from 'leaflet';
import SupermarketContext from "../User/SupermarketContext";
import SupermarketsCon from "../User/SupermarketsCon";
export default function MapCurrentLocation(props) {

    const setOffers = props.setOffers;
    const getOffers = props.getOffers;
    const {showProduct,setShowProduct} = useContext(ShopClickedContext);
    const [currentLocation,setCurrentLocation] = useState(null);

    const {clickedSupermarket,setClickedSupermarket} = useContext(SupermarketContext);
    const {supermarkets,setSupermarkets} = useContext(SupermarketsCon);
    useEffect(() => {
        if(props.isClicked === "Current Location"){
            axios.get("http://localhost:5000/api/getCurrentLocation").then((response) => {
                setOffers(response.data);
            });
        }

        if(props.isClicked === "Search"){
            setClickedSupermarket({clicked:false})
            setShowProduct({show:false})
            axios.get('http://localhost:5000/api/getSupermarket')
            .then((response) => {
                setSupermarkets(response.data);
            })
        }

        if( props.isClicked === "Categories"){
            setClickedSupermarket({clicked:false})
            setShowProduct({show:false});
            axios.get("http://localhost:5000/api/getCurrentLocation").then((response) => {
                setOffers(response.data);
            });
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

    const handleOfferSupermarketClick = (supermarket_id,coordinates) => {
        axios.post('http://localhost:5000/api/getOffers',{supermarket_id:supermarket_id})
        .then(response=>{
            setShowProduct({
                show:true,
                offers:response.data,
                super_name:response.data[0].supermarkets[0].properties.name ||response.data[0].supermarkets[0].properties.shop,
                isNear:true,//currentLocation.distanceTo(coordinates) <50 ? true : false,
                supermarket_id:supermarket_id
            });
        });
    }
    
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

            {currentLocation!==null ? <Circle center={currentLocation} radius={50} color={'transparent'} fillColor={'#1935e7'} fillOpacity={0.5}/> :""}
            {getOffers !== null ? (
                getOffers.map(result=>(
                    <Marker 
                        key={result._id}
                        position={result.geometry.coordinates.reverse()} 
                        icon={offerIcon}
                        eventHandlers={{
                            click: (e) => {
                                handleOfferSupermarketClick(result._id,result.geometry.coordinates.reverse())
                            },
                        }}
                    >
                    
                        <Tooltip>
                            {result.properties.name || result.properties.shop}
                        </Tooltip>
                        
                    </Marker>

                ))
            ):""}

            {supermarkets!==null && props.isClicked === "Search" ?
                (
                    supermarkets.map(supermarket=>(
                        <Marker
                            key={supermarket._id}
                            position={supermarket.geometry.coordinates.reverse()}
                            icon={supermarketIcon}
                            eventHandlers={{
                                click:(e)=>{

                                    setClickedSupermarket({
                                        clicked:true,
                                        name:supermarket.properties.name || supermarket.properties.shop,
                                        id:supermarket._id,
                                        isNear:true//currentLocation.distanceTo(supermarket.geometry.coordinates.reverse()) <50 ? true : false,
                                    });
                                }
                            }}
                                
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