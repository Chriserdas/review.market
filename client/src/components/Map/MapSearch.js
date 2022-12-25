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
  const markersLayer = new L.LayerGroup(); //layer contain searched elements
  map.addLayer(markersLayer);
  useEffect(() => {
    const controlSearch = new L.Control.Search({
      position: "topleft",
      layer: markersLayer,
      initial: false,
      zoom: 20,
      marker: false,
    });

    map.addControl(controlSearch);

    const LeafIcon = L.Icon.extend({
      options: {}
    });
  
    const orangeIcon = new LeafIcon({
        iconUrl:
          "https://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|ffa500&chf=a,s,ee00FFFF"
      }),
      redIcon = new LeafIcon({
        iconUrl:
          "https://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|ff0000&chf=a,s,ee00FFFF"
      });
  
    const getPois = async () => {
      try {
            const responce = await Axios.get("http://localhost:5000/api/supermarket")
            responce.data.forEach((item) =>{
              for(let i = 0; i<item.features.length; i++){
                let marker = new L.Marker(new L.latLng(item.features[i].geometry.coordinates[1],item.features[i].geometry.coordinates[0]), {title:item.features[i].properties.name, icon: orangeIcon});
                marker.bindPopup(
                    "Name: " + item.features[i].properties.name  + " | " +
                    "Shop: " + item.features[i].properties.shop
                );
                markersLayer.addLayer(marker);
              }
           });
      } catch (err) {
          // Handle Error Here
          console.error(err);
      }
  };
  getPois()
  }, []);

  return null;
}