import {React,useState,useEffect} from "react";
import sale_logo from "../../images/sale_logo.png"
import likeImage from "../../images/like.png"
import likeFilledImage from "../../images/like_filled.png"
import axios from "axios";


const Offers = (props)=>{

    const userId = JSON.parse(localStorage.getItem("token")).user._id;
    const [offers,setOffers] = useState(props.offers);
    const isNear = props.isNear;
    

    
    const handleLikeClick = (offerId,index,url) => {
        axios.patch(url,{userID:userId,offerID:offerId}).then(response => {
            const newOffers = [...offers];
            newOffers[index].likes = response.data.likes;
            newOffers[index].dislikes = response.data.dislikes;
            setOffers(newOffers);
        })        
    }

    useEffect(() => {
        setOffers(props.offers);
     }, [props.offers]);

    return (
        offers.map((offer,index) =>(
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
                            //onChange={/*event => handlePriceChange(event,offer.price)*/}
                        />        
                    </div>

                    <div className="product_stock" style={{ backgroundColor: offer.stock === true ? "green" : "red" }}>
        
                        {offer.stock=== true ? "in stock" : "out of stock"}
                        
                    </div>

                    <div className="product_like">

                        <img 
                            src={
                                offer.likes.includes(userId) ? likeFilledImage : likeImage
                            }  
                            onClick={()=>
                                handleLikeClick(offer._id,index,"http://localhost:5000/api/offer/likeOffer")
                                
                            } 
                            alt=""
                        />
                        <p>{offer.likes.length}</p>
                        <img 
                            src={offer.dislikes.includes(userId) ? likeFilledImage : likeImage} 
                            alt="" 
                            className="dislike"
                            onClick={()=>
                                handleLikeClick(offer._id,index,"http://localhost:5000/api/offer/dislikeOffer")
                                
                            } 
                        />
                        <p>{offer.dislikes.length}</p>
                    </div>

                </div>
            </div>
        )
    ))
    
}

export default Offers;