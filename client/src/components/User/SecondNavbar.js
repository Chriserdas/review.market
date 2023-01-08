import {React, useEffect} from "react";
import {motion,useAnimation} from "framer-motion";

const SecondNavbar = (props)=>{

    const show = props.open;
    const animate = useAnimation();

    useEffect(()=>{
        if(show){
            animate.start({
                flexGrow: 1,
                flexShrink: "0",
                flexBasis: "fit-content",
            });
        }
    },[show]);
    return (
        <motion.div className="secondNavbar"
            animate={animate}
        
        >
        </motion.div>
    );
}

export default SecondNavbar;