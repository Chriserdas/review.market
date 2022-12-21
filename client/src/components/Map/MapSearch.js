import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet-search";
import L from "leaflet";
import  Axios  from "axios";

export default function MapWithSearch() {
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
  const map = useMap();

  useEffect(() => {
    map.locate().on("locationfound", function (e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    });
  }, [map]);

  return position === null ? null : (
    <Marker position={position}>
      <Popup></Popup>
    </Marker>
  );
}

function Search() {
  const map = useMap();

  const markersLayer = new L.LayerGroup(); //layer contain searched elements
  map.addLayer(markersLayer);
}