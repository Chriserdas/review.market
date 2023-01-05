import React from "react";
import MapCurrentLocation from "../Map/MapCurrentLocation";


const Map = (props)=>{

    return (
        <div className="map">
            <MapCurrentLocation isClicked={props.isClicked}/>
        </div>
    );
}


export default Map;