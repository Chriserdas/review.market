import {React, useEffect,useRef} from "react";
import Map from "./Map";
import {motion,useAnimation} from "framer-motion";
import OfferedProducts from "./OfferedProducts";

const MapContainer = (props)=>{
    const show = props.productInfo.show;
    const productInfo = props.productInfo;
    const super_name = props.productInfo.super_name;
    const animate = useAnimation();

    useEffect(()=>{
        if(show){
            animate.start({
                width:"calc(99vw - 500px)",
                height:"95%",
                borderRadius:"10px"
            });
        }
        else{
            animate.start({
                width:"calc(100vw - 100px)",
                height:"100%",
                borderRadius:"0px"
            });
        }

        if(props.isClicked === "Search" || props.isClicked === 'Categories'){
            animate.start({
                width:"calc(99vw - 500px)",
                height:"95%",
                borderRadius:"10px"
            });
        }
    },[show,props.isClicked]);

    return (
        <motion.div className="MapContainer"
            animate={animate}
        >
            <OfferedProducts productInfo = {productInfo} setClicked={props.setClicked} isClicked={props.isClicked} setShowProduct = {props.setShowProduct}/>
            <Map isClicked={props.isClicked} productInfo={productInfo} getOffers={props.getOffers} setOffers={props.setOffers}/>
        </motion.div>
    );
}

export default MapContainer;