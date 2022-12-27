import React, { useEffect } from "react";
import {motion,useAnimation} from "framer-motion";
import { Link } from "react-router-dom";
export default function NotificationPopup(props){
    const message = props.message;
    const color = props.color;
    const activate = props.activate;
    const controlAnimation = useAnimation();

    useEffect(()=>{
        controlAnimation.start({
            initial:{y:"-20%"},
            y:["5%","1%"],
            transition :{durations:"3s"},
            onTransitionEnd:{display: "none"}
        });

        return ()=>{
            window.location = '/UserHome'
        }
    },[activate]);
    return (
        <div className="notification_popup_container">
            <motion.div 
                className="notification_popup" 
                style={{backgroundColor:color}}
                animate={controlAnimation}
            >{message}</motion.div>
        </div>
        
    );
}