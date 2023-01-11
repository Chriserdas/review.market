import {React, useEffect,useRef} from "react";
import {motion,useAnimation} from "framer-motion";

const SecondNavbar = (props)=>{

    const show = props.open;
    const animate = useAnimation();
    
    useEffect(()=>{
        if(show){
            
            animate.start({
                width:"400px",
            });
        }
        else{
            animate.start({
                width:"0px",
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