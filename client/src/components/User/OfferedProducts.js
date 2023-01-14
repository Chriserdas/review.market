import {React, useEffect,useState,useRef,TextField} from "react";
import {motion,useAnimation} from "framer-motion";
import sale_logo from "../../images/sale_logo.png"
import likeImage from "../../images/like.png"
import likeFilledImage from "../../images/like_filled.png"
import axios from "axios";

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
    const [color,setColor] = useState("");
    const containerRef = useRef(null);
    const isClicked = props.isClicked;
    /*const [leftDisabled, setLeftDisabled] = useState(false);
    const [rightDisabled, setRightDisabled] = useState(false);*/
    //const [priceValue,setPriceValue] = useState()

    function handleScrollLeft() {
        containerRef.current.scrollLeft -= 100;
    }

    function handleScrollRight() {
        containerRef.current.scrollLeft += 100;
    }

    const handlePriceChange = (event,previousPrice)=>{
        
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

    const handleLikeClick = (offerId) => {
        axios.patch("http://localhost:5000/api/offer/likeOffer",{userID:userId,offerID:offerId}).then(response => {
            console.log(response);
        })        
    }

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

                    onClick={()=>window.location='/UserHome'}
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
                
                {offers ===  undefined ? "" : ( 
                    offers.map(offer =>(
                        //product.stock === 1 ? setColor("green") : setColor("red")
                        <div key = {offer._id} className="product_container">
                            <div className="first_row">
                                <div className="image_container"> 
                                    <img src ={offer.products[0].image} alt=""/>
                                </div>
                                <div className="hot_logo"> 
                                    <img src={sale_logo} alt=""/>
                                </div>

                                <div className="product_name">{offer.products[0].name}</div>
                            </div>

                            <div className="second_row">
                                <div className="price">Price: 
                                    <input
                                        key={offer._id}
                                        readOnly={!isNear}
                                        defaultValue={offer.price}
                                        onChange={event => handlePriceChange(event,offer.price)}
                                    />        
                                </div>

                                <div className="product_stock" style={{ backgroundColor: offer.stock === true ? "green" : "red" }}>
                    
                                    {offer.stock=== true ? "in stock" : "out of stock"}
                                    
                                </div>

                                <div className="product_like">

                                    <img src={offer.likes.includes(userId) ? likeFilledImage : likeImage}  onClick={()=>handleLikeClick(offer._id)} alt=""/>
                                    <p>{offer.likes.length}</p>
                                    <img src={offer.dislikes.includes(userId) ? likeFilledImage : likeImage} alt="" className="dislike"/>
                                    <p>{offer.dislikes.length}</p>
                                </div>

                            </div>
                        </div>
                    )
                ))}
            </div>
            <div className="scrollArrowsContainer">
                    <button onClick={handleScrollLeft} className="left_scroll">&lt;</button>
                    <button onClick={handleScrollRight} className="right_scroll">&gt;</button>
            </div>
            
        </motion.div>
    );
}


export default OfferedProducts;