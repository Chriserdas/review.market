import React, { useEffect } from "react";
import {motion,useAnimation} from "framer-motion";
import { Link } from "react-router-dom";

export default function NotificationPopup(props){
    const message = props.message;
    const color = props.color;
    const activate = props.activate;
    const controlAnimation = useAnimation();
    useEffect(()=>{
        if (activate) {
            controlAnimation.start({
                y:[-1000,0,0,0,-1000],
            });
        }
    },[activate]);

    return (
        <motion.div className="notification_popup_container"
            initial={{y:"-100vh"}}
            animate={controlAnimation}
            transition={{duration:3}}
        >
            <div 
                className="notification_popup" 
                style={{backgroundColor:color}}
            >{message}</div>
        </motion.div>
        
    );
}