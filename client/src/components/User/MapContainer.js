import {React} from "react";
import Map from "./Map";


const MapContainer = (props)=>{
    return (
        <div className="MapContainer">
            <Map isClicked={props.isClicked}/>
        </div>
    );
}

export default MapContainer;