import {React, useEffect,useRef} from "react";
import {motion,useAnimation} from "framer-motion";

const SecondNavbar = (props)=>{

    const show = props.productInfo.show;
    const isClicked = props.isClicked
    const animate = useAnimation();
    const isNear = props.productInfo.isNear;
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

        if(isClicked === 'Search'){
            animate.start({
                width:"400px",
            });
        }
    },[show,isClicked]);

    let showDiv
    
    if(show){
        showDiv = 
            <div>
                {isNear===true ? 
                    (
                        <div></div>
                    )
                    :
                    (
                        <div className="secondNavbar_not_near">
                                You should be less than 50 meters away from the supermarket to create an offer
                        </div>
                    )
                }
            </div>
    }

    return (
        <motion.div className="secondNavbar"
            animate={animate}
        >

            {showDiv}
        </motion.div>
    );
}

export default SecondNavbar;