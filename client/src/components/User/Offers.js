import {React,useState,useEffect} from "react";
import sale_logo from "../../images/sale_logo.png"
import likeImage from "../../images/like.png"
import likeFilledImage from "../../images/like_filled.png"
import notNearLike from "../../images/like_grey.png"
import NotificationPopup from "../NotificationPopup.js"
import axios from "axios";
import {motion,useAnimation} from "framer-motion";


const Offers = (props)=>{

    const userId = JSON.parse(localStorage.getItem("token")).user._id;
    const [offers,setOffers] = useState(props.offers);
    const isNear = props.isNear;
    const [isHovered,setIsHovered] = useState(false)
    const animate = useAnimation();

    const handleLikeClick = (offerId,index,url,offerStock) => {

        if(isNear && offerStock) {
            axios.patch(url,{userID:userId,offerID:offerId}).then(response => {
                const newOffers = [...offers];
                newOffers[index].likes = response.data.likes;
                newOffers[index].dislikes = response.data.dislikes;
                setOffers(newOffers);
            })        
        }        
    }

    const handleStockChange = (offerId,offerStock,index) => {


        if(isNear){
            axios.patch('http://localhost:5000/api/offer/stock',
                                                    {offerID:offerId,offerStock:offerStock})
            .then(response => {
                const newOffers = [...offers];
                    newOffers[index].stock = response.data.stock;
                    setOffers(newOffers);
            })
        }
    }

    function handleLikeImage(likes,offerStock){
        if(!isNear || !offerStock) {
            return notNearLike;
        }
        if(likes.includes(userId)) {
            return likeFilledImage;
        }
        else{
            return likeImage;
        }
    }

    useEffect(() => {
        setOffers(props.offers);
     }, [props.offers]);

    return (
        offers.map((offer,index) =>(
            <div key = {offer._id} 
                className="product_container">
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
                        <div key={offer._id}>{offer.price}</div>
                    </div>

                    <div className="product_stock" style={{ backgroundColor: offer.stock === true ? "green" : "red" }} onClick={()=>handleStockChange(offer._id,offer.stock,index)}>
        
                        {offer.stock=== true ? "in stock" : "out of stock"}
                        
                    </div>

                    <div className="product_like">

                        <img 
                            src={handleLikeImage(offer.likes,offer.stock)}  
                            onClick={()=>
                                handleLikeClick(offer._id,index,"http://localhost:5000/api/offer/likeOffer",offer.stock)
                            } 
                            alt=""
                        />
                        <p>{offer.likes.length}</p>
                        <img 
                            src={handleLikeImage(offer.dislikes,offer.stock)} 
                            alt="" 
                            className="dislike"
                            onClick={()=>
                                handleLikeClick(offer._id,index,"http://localhost:5000/api/offer/dislikeOffer",offer.stock)      
                            } 
                        />
                        <p>{offer.dislikes.length}</p>
                    </div>
                </div>   
                <div className="createDate">
                    
                    <div className="date">Created Date: {new Date(offer.createdDate).toLocaleDateString()}</div>
                
                    {<div style={{display: isNear === false ? 'none' : 'flex' }}>Created By: {offer.user[0].username}</div>}
                    
                </div>   
            </div> 
        ))
         
        
                 
    )
    
}

export default Offers;