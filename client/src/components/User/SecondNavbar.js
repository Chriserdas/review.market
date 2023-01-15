import {React, useEffect,useState} from "react";
import {motion,useAnimation} from "framer-motion";
import axios from "axios";

const SecondNavbar = (props)=>{

    const show = props.productInfo.show;
    const isClicked = props.isClicked
    const animate = useAnimation();
    const isNear = props.productInfo.isNear;
    const [category,setCategory] = useState("Choose category");
    const animateCategories = useAnimation();
    const [clickCategory,setClickCategory] = useState(false)
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

    /*const handleCategoryClick = ()=>{
        animateCategories.start({
            display:"flex",
        })
    }*/

    useEffect(()=>{
        if(clickCategory){
            animateCategories.start({
                display:"flex",
            })
            axios.get("http://localhost:5000/api/productInfo").then((response)=>{
                console.log(response);
            })
        }
        else{
            animateCategories.start({
                display:"none",
            })
        }

    },[clickCategory])

    let showDiv
    
    if(show){
        showDiv = 
            <div>
                {isNear===true ? 
                    (
                        <div className="secondNavbar_near">
                            <div className="choose_container">
                                <div className="createOffer_txt">Create an Offer</div>
                                <div className="choose_name">Choose by category</div>
                                <div className="choose_category">
                                    <div className="choose_category_title" onClick={()=>setClickCategory(!clickCategory)}>{category} <div>&gt;</div></div>
                                    <motion.div className="categories" animate={animateCategories}></motion.div>
                                </div>
                            </div>
                            <div className="search_product">

                            </div>
                        </div>
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