for(let i = 0; i<item.features.length; i++){
    let marker = new L.Marker(new L.latLng(item.features[i].geometry.coordinates[1],item.features[i].geometry.coordinates[0]), {title: item.features[i].properties.name});
    marker.bindPopup(
        "Name: " + item.features[i].properties.name  + " | " +
        "Shop: " + item.features[i].properties.shop
    );
    markersLayer.addLayer(marker);
  }