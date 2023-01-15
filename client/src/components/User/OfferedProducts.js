import {React, useEffect,useState,useRef,TextField} from "react";
import {motion,useAnimation} from "framer-motion";
import sale_logo from "../../images/sale_logo.png"
import likeImage from "../../images/like.png"
import likeFilledImage from "../../images/like_filled.png"
import axios from "axios";
import Offers from "./Offers";

const OfferedProducts = (props) => {
    const show = props.productInfo.show;
    const super_name = props.productInfo.super_name;
    const isAdmin = JSON.parse(localStorage.getItem("token")).user.isAdmin;
    const userId = JSON.parse(localStorage.getItem("token")).user._id;
    const isNear = props.productInfo.isNear;
    const offers = props.productInfo.offers;
    const animate = useAnimation();
    const [isHover,setIsHover] = useState(false);
    const animateBack = useAnimation();
    const animateColor = useAnimation();
    const containerRef = useRef(null);
    const isClicked = props.isClicked;

    function handleScrollLeft() {
        containerRef.current.scrollLeft -= 100;
    }

    function handleScrollRight() {
        containerRef.current.scrollLeft += 100;
    }

    const handleBack = ()=>{
        if(props.isClicked === "Current Location"){
            props.setShowProduct({show:false})
        }
        props.setClicked("Current Location");
    }

    useEffect(() => {
        if(show){
            animate.start({
                width: "100%",
                height:"50%",
                display: 'flex',
                flexDirection: 'column',  
            }); 
        }
        else{
            animate.start({
                width: "0%",
                height:"0%"  
            });
        }

        if(isClicked === 'Search' && !show) {
            animate.start({
                display: 'none',
            })
        }
    },[show,isClicked]);

    useEffect(() => {

        if(isHover){
            animateBack.start({
                display: "block",
                cursor: "pointer"
            })

            animateColor.start({
                color: "white",
                backgroundColor: "#353535"
            })
        }
        else{
            animateBack.start({
                display:"none"
            })

            animateColor.start({
                color: "black",
                backgroundColor: "#EBEBEB"
            })
        }
    },[isHover]);

    return (
        <motion.div className="OfferedProducts_container"
            animate={animate}
        >
            <div className="super_name_container"> 

                <motion.div className="back" 
                    onMouseEnter={()=>{
                        setIsHover(true);
                    }}
                    onMouseLeave={()=>{
                        setIsHover(false);
                    }}
                    animate={animateColor}

                    onClick={()=> handleBack()}
                > 
                    <div>&lt; </div>
                    <motion.div
                        animate={animateBack}
                        className="back_symbol"
                    >
                        back to map
                    </motion.div>
                </motion.div>
                <div className="super_name">{super_name}</div>
            
            </div>

            
            <div className="products" ref={containerRef}>
                {offers===undefined ? "" : <Offers offers={offers} isNear={isNear}/>}
            </div>
            <div className="scrollArrowsContainer">
                    <button onClick={handleScrollLeft} className="left_scroll">&lt;</button>
                    <button onClick={handleScrollRight} className="right_scroll">&gt;</button>
            </div>
            
        </motion.div>
    );
}


export default OfferedProducts;