import {React,useEffect }from "react";
import MapCurrentLocation from "../Map/MapCurrentLocation";
import {motion,useAnimation} from "framer-motion"


const Map = (props)=>{
    const show = props.productInfo.show;
    const isClicked = props.isClicked;
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

        if(isClicked === 'Search' && !show || isClicked === 'Categories'){
            animate.start({
                width: "100%",
                height:"100%",
                
            });
        }
    },[show,isClicked]);

    return (
        <motion.div className="map"
            animate={animate}
        >
            {<MapCurrentLocation isClicked={props.isClicked} getOffers={props.getOffers} setOffers={props.setOffers} />}
        </motion.div>
    );
}


export default Map;