import React, { useEffect, useState,useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap,Tooltip } from "react-leaflet";
import L from 'leaflet'
import axios from "axios";
export default function MapCurrentLocation(props) {

    const [data,setData] = useState(null);
    const markerRef = useRef();
    const [isShowDetails,setShowDetails] = useState({
        show:false,
        data:null
    });
  
    useEffect(() => {
        if(props.isClicked === "Current Location"){
            axios.get("http://localhost:5000/api/getCurrentLocation").then((response) => {
                setData(response.data);
            });
        }
    },[props.isClicked]);

    
    const offerIcon = new L.icon({
        iconUrl: require('./../../images/offer_marker.png'),
        iconSize: [55,55],
    });


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
            
            <LocationMarker />

            { data === null ? "" : (
            Object.entries(data).map(([key,value]) => (
                
                <Marker 
                    key={key} 
                    position={value.geometry.coordinates.reverse()} 
                    icon={offerIcon}
                    eventHandlers={{
                        click: (e) => {
                            setShowDetails({
                                show:true,
                                data:value.id
                            })
                        },
                    }}
                >
                
                    <Tooltip>
                        {value.properties.name || value.properties.shop}
                    </Tooltip>
                    
                </Marker>
                
            )))}
        </MapContainer>
    );
}


function LocationMarker() {
  const [position, setPosition] = useState(null);

  const map = useMap();

  useEffect(() => {
    map.locate().on("locationfound", function (e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    });
  }, [map]);

  return position === null ? null : (
    <Marker position={position}>
      <Tooltip>
        Your current location. <br />
      </Tooltip>
    </Marker>
  );
}