import {React, useEffect,useState} from "react";
import {motion,useAnimation} from "framer-motion";
import sale_logo from "../../images/sale_logo.png"

const OfferedProducts = (props) => {
    const show = props.productInfo.show;
    const super_name = props.productInfo.super_name;
    const offers = props.productInfo.offers;
    const animate = useAnimation();
    const [isHover,setIsHover] = useState(false);
    const animateBack = useAnimation();
    const animateColor = useAnimation();
    const [color,setColor] = useState("");

    useEffect(() => {
        if(show){
            animate.start({
                width: "100%",
                height:"50%",
                display: 'block',  
            }); 
        }
        else{
            animate.start({
                width: "0%",
                height:"0%"  
            });
        }
    },[show]);

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

            <div className="products">
        
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
                                <div className="price">Price: {offer.price}{"\u20ac"}</div>
                                <div className="product_stock" style={{ backgroundColor: offer.stock === true ? "green" : "red" }}>{offer.stock=== true ? "in stock" : "out of stock"}</div>
                            </div>
                        </div>
                    )
                ))}
            </div>
        </motion.div>
    );
}


export default OfferedProducts;