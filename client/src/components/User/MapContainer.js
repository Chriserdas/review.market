import {React, useEffect} from "react";
import Map from "./Map";
import {motion,useAnimation} from "framer-motion";

const MapContainer = (props)=>{
    const show = props.open;
    const animate = useAnimation();


    useEffect(()=>{
        if(show){
            animate.start({
                width:"70%",
                height:"90%",
            });
        }
    },[show]);
    return (
        <div className="MapContainer"
            
        >
            <Map isClicked={props.isClicked}/>
        </div>
    );
}

export default MapContainer;