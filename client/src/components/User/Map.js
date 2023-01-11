import {React,useEffect }from "react";
import MapCurrentLocation from "../Map/MapCurrentLocation";
import {motion,useAnimation} from "framer-motion"


const Map = (props)=>{
    const show = props.productInfo.show;
    const animate = useAnimation();
    useEffect(() => {
        if(show){
            animate.start({
                width: "100%",
                height:"50%",
                justifyContent: "center"
            });
        }
        else{
            animate.start({
                width: "100%",
                height:"100%",
                justifyContent: "center"
            });
        }
    },[show]);

    return (
        <motion.div className="map"
            animate={animate}
        >
            {<MapCurrentLocation isClicked={props.isClicked}/>}
        </motion.div>
    );
}


export default Map;