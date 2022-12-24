import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet-search";
import "leaflet-search/dist/leaflet-search.min.css";
import L from "leaflet";
import  Axios  from "axios";

export default function MapSearch() {
    return (
        <MapContainer
          center={[38.246639, 21.734573]}
          zoom={13}
          scrollWheelZoom
          animate={true}
          style={{ width: "100%", height: "90vh" }}
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker />
          <Search />
        </MapContainer>
      );
    }
    
    
    function LocationMarker() {
      const [position, setPosition] = useState(null);
      const [bbox, setBbox] = useState([]);
    
      const map = useMap();
    
      useEffect(() => {
        map.locate().on("locationfound", function (e) {
          setPosition(e.latlng);
          map.flyTo(e.latlng, map.getZoom());
          setBbox(e.bounds.toBBoxString().split(","));
        });
      }, [map]);
    
      return position === null ? null : (
        <Marker position={position}>
          <Popup>
            You're current location. <br />
            Map bbox: <br />
            <b>Southwest lng</b>: {bbox[0]} <br />
            <b>Southwest lat</b>: {bbox[1]} <br />
            <b>Northeast lng</b>: {bbox[2]} <br />
            <b>Northeast lat</b>: {bbox[3]}
          </Popup>
        </Marker>
      );
    }

function Search() {
  const map = useMap();

  
    useEffect(() => {
        const markersLayer = new L.LayerGroup(); //layer contain searched elements
        map.addLayer(markersLayer);
        const controlSearch = new L.Control.Search({
        position: "topleft",
        layer: markersLayer,
        initial: false,
        zoom: 20,
        marker: false,
        });

        map.addControl(controlSearch);

        const getPois = async () => {
        try {
                const response = await Axios.get("http://localhost:5000/api/supermarket"); 
                response.data.forEach((item) =>{
                    let marker = new L.Marker(new L.latLng(item.coordinates[1],item.coordinates[0]), {title: item.name});
                    marker.bindPopup(
                        "Name: " + item.features.properties.name
                    );
                    markersLayer.addLayer(marker);
                });
                
            
        } catch (err) {
            // Handle Error Here
            console.error(err);
        }
        };
    getPois()
    },[map]);

  return null;  //don't want anything to show up from this comp
}