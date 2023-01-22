import {React, useContext, useEffect,useState} from "react";
import {motion,useAnimation} from "framer-motion";
import axios from "axios";
import SupermarketSearch from "./SupermarketSearch";

const SecondNavbar = (props)=>{

    const show = props.productInfo.show;
    const isClicked = props.isClicked
    const animate = useAnimation();
    const userId = JSON.parse(localStorage.getItem("token")).user._id;

    const [searchValue,setSearchValue] = useState("");

    let [priceValue,setPriceValue] = useState("");
    const [stock,setStock] = useState(true)
    const [category,setCategory] = useState({
                                    name:"Choose category",
                                    id:""
                                });
    const animateCategories = useAnimation();
    const [clickCategory,setClickCategory] = useState(false);
    const [categories,setCategories] = useState(null);
    
    const [clickSubCategory,setClickSubCategory] = useState(false);
    const [subCategory,setSubCategory] = useState({
                                        name:"Choose Subcategory",
                                        uuid:""
                                    });
    const [subCategories,setSubCategories] = useState(null);
    const animateSubCategories = useAnimation();


    const [showproducts,setShowproducts] = useState(false);
    const [product,setProduct] = useState({
                                    name:"Choose Product",
                                    id:""
                                });
    const animateProducts = useAnimation();
    const [products,setProducts] = useState(null);
    const [clickProduct,setProductClick] = useState(false);
    
    const [createOffer,setCreateOffer] = useState(false);
    const [showSearchResult,setShowSearchResult] = useState(false);
    const clickedSupermarket = props.getSupermarket;
    const setClickedSupermarket = props.setClickedSupermarket;

    const [clickCat,setClickCat] = useState(null);
    const [catHovered,setCatHovered] = useState(null);
    useEffect(()=>{
        if(show){
            setClickCat(null);
            animate.start({
                width:"400px",
            });
        }
        else{
            setClickCat(null);
            animate.start({
                width:"0px",
            });
        }

        if(isClicked === 'Search' ||isClicked==='Categories'){
            setClickCat(null);
            animate.start({
                width:"400px",
            });
        }
    },[show,isClicked]);

    useEffect(()=>{
        setCategory({name:"Choose Category"});
        setProductClick(false);
        setSubCategory({name:"Choose Subcategory"})
        setSubCategories(null);
        setShowSearchResult(false);
        setSearchValue("");
        setCreateOffer(false);
    },[clickedSupermarket.name])

    const handleCategoryClick = (result) => {
        setClickCategory(false);
        setSubCategory({name:"Choose Subcategory", uuid:""})
        setCategory({
            name:result.name,
            id:result.id,
        })
        setSubCategories(result.subcategories)
    }


    const handleSubCategoryClick = (result) => {
        setClickSubCategory(false);
        
        setSubCategory({
            name:result.name,
            uuid:result.uuid,
        })
    }

    const handleProductClick = (name,id) => {
        setProductClick(false);
        setProduct({name,id});
    }
    useEffect(()=>{
        if(clickCategory){
            setShowSearchResult(false);
            setProduct({name:"Choose Product"});
            setCreateOffer(false);
            setSearchValue("");
            setClickSubCategory(false);
            setProductClick(false);
            animateCategories.start({
                display:"flex",
                flexDirection:"column",
                alignItems: "center",
                justifyContent: "flex-start",
            })
            axios.get("http://localhost:5000/categories").then((response)=>{
                setCategories(response.data);
            })
        }
        else{
            animateCategories.start({
                display:"none",
            })
        }

        if(clickSubCategory){
            setShowSearchResult(false);
            setCreateOffer(false);
            setProductClick(false);
            setProduct({name:"Choose Product"})
            animateSubCategories.start({
                display:"flex",
                flexDirection:"column",
                alignItems: "center",
                justifyContent: "flex-start",
            })
        }
        else{
            animateSubCategories.start({
                display:"none",
            })
        }

        if(clickProduct){
            setCreateOffer(false);
            setShowSearchResult(false);
            setPriceValue("");
            animateProducts.start({
                display:"flex",
                flexDirection:"column",
                alignItems: "center",
                justifyContent: "flex-start",
                
            });

            axios.post('http://localhost:5000/api/product/product',{
                                                            categoryID:category.id,
                                                            subcategoryID: subCategory.uuid
                                                        })
            .then(response=>{
                setProducts(response.data);
            });
        }
        else{
            animateProducts.start({
                display:"none",
            })
        }

    },[clickCategory,clickSubCategory,clickProduct])


    useEffect(()=>{
        if(category.name !== "Choose Category" && subCategory.name!=="Choose Subcategory"){
            setShowproducts(true);
        }
        else setShowproducts(false);
    },[category,subCategory]);

    const handleOnChange = (event) => {
        const input = event.target.value;

        if (/^\d*\.?\d*$/.test(input)) {
            setPriceValue(input);
        }  
    }


    const handleSubmitOffer = ()=>{
        if(priceValue !=="" && product.id !==""){
            axios.post("http://localhost:5000/api/offer/store",{
                                                            userId:userId,
                                                            stock:stock,
                                                            price:priceValue,
                                                            productId:product.id,
                                                            supermarketId:clickedSupermarket.id
                                                        })
            .then(response=>{
                window.location = "/UserHome";
            });
            
        }
    }


    const handleSearch = (event) => {
        setSearchValue(event.target.value);
        setCategory({name:"Choose Category",id:"",});
        setSubCategory({name:"Choose SubCategory",uuid:"",});
        
        if(event.target.value !==""){
            setShowSearchResult(true)
            axios.post('http://localhost:5000/api/product/search',{productString:event.target.value})
            .then(response=>{
                setProducts(response.data);
            });
        }
        else{
            setCreateOffer(false);
            setShowSearchResult(false);
        }
    }

    const handleOfferCategory = (id)=>{
        setClickCat(id);

        axios.post('http://localhost:5000/api/offer',{categoryId:id})
        .then(response=>{
            //props.setOffers(response.data.supermarkets);
            if(response.data.length === 0){
                props.setOffers(null);
            }
            else{
                const supermarkets = response.data.map(offer=>offer.supermarkets);
                props.setOffers(supermarkets)
            }
        })
    }

    let showDiv = 
            <div>
                {clickedSupermarket.isNear===true ? 
                    (
                        <div className="secondNavbar_near">
                            <div className="choose_container">
                                <div className="choose_name">Choose by category</div>
                                <div className="choose_category">
                                    <div className="choose_category_title" onClick={()=>setClickCategory(!clickCategory)}>{category.name} <div>&gt;</div></div>
                                    <motion.div className="categories" animate={animateCategories}>
                                        {categories !== null ? 
                                            (
                                                categories.map(result => (
                                                    <div key={result._id} className="category" onClick={()=>handleCategoryClick(result)}>{result.name}</div>
                                                ))
                                            )
                                            : ""
                                        }
                                    </motion.div>
                                </div>

                                <div className="choose_subcategory">
                                    <div className="choose_category_title" onClick={()=>setClickSubCategory(!clickSubCategory)}>{subCategory.name} <div>&gt;</div></div>
                                    <motion.div className="categories" animate={animateSubCategories}>
                                        {subCategories !== null ? 
                                            (
                                                subCategories.map(result => (
                                                    <div key={result.uuid} className="category" onClick={()=>handleSubCategoryClick(result)}>{result.name}</div>
                                                ))
                                            )
                                            : <div style={{fontFamily:"Manrope-Regular"}}>Choose Category first!</div>
                                        }
                                    </motion.div>
                                </div> 

                                {showproducts ===true ? 
                                    (
                                        <div className="chooseProduct">
                                            <div className="product_title" onClick={()=>setProductClick(!clickProduct)}> {product.name}<div>&gt;</div></div>

                                            <motion.div className="all_products" animate={animateProducts}>
                                                {products !== null ? 
                                                    (
                                                        products.map(product => (
                                                            <div key ={product._id} className="category" onClick={()=>handleProductClick(product.name,product._id)}>{product.name}</div>
                                                        ))
                                                    )
                                                    : <div style={{fontFamily:"Manrope-Regular"}}>No products to show!</div>
                                                }
                                            </motion.div>
                                        </div>
                                    ) 
                                    :""
                                }

                                {(category.name !== "Choose Category" 
                                    && subCategory.name!=="Choose Subcategory" 
                                    && product.name !=="Choose Product") || createOffer ===true ?
                                        
                                        (
                                            <div className="submit_offer_container">
                                                <div className="productTitle">{product.name}</div>
                                                <div className="submitOfferWrapper">
                                                    <div className="set_price">Price:
                                                        <input
                                                            value={priceValue}
                                                            onChange={handleOnChange}
                                                        />
                                                    </div>
                                                    <div className="set_stock"> 
                                                        Stock:
                                                        <div 
                                                        style={{backgroundColor: stock===true ? "green" : "red"}} 
                                                        onClick={()=>{
                                                            setStock(!stock);
                                                        }}
                                                        > {stock.toString()}</div>
                                                    </div>
                                                    
                                                </div>
                                                <div className="submit_offer" onClick={()=>handleSubmitOffer()}>Submit Offer</div>
                                            </div>
                                        )
                                        :""
                                }
                            </div>
                            <div className="search_product">
                                <div className="createOffer_txt">Create an Offer</div>
                                <div className="supermarketClicked">
                                    <div className="superName">
                                        {clickedSupermarket.name}
                                    </div>
                                    
                                    {clickedSupermarket.clicked===true ? 
                                        (
                                            <div 
                                                className="goBackToSearch" 
                                                onClick={()=>{
                                                    setClickedSupermarket({clicked:false})
                                                }}
                                            >back to search</div>
                                        )
                                        :""
                                    }
                                </div>
                                <div className="createOffer_search_container">
                                    <div className="createOffer_search">
                                        <input
                                            value={searchValue}
                                            placeholder="Search for products..."
                                            onChange={handleSearch}
                                        
                                        />
                    
                                    </div>
                                    <div className="search_results" style={{display:showSearchResult===true ? 'flex' : 'none'}}>
                                        {showSearchResult===true && products!==null ?
                                            
                                            (
                                                products.map(product=>(

                                                    <div key={product._id} className="category" onClick={()=>{
                                                        setProduct({name:product.name, id:product._id})
                                                        setCreateOffer(true);
                                                    }}>
                                                        {product.name} 
                                                    </div>
                                            
                                                ))
                                            ) 
                                            :""
                                            
                                        }
                                    </div>
                                </div>
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

    
        let content;

        if(show === true && isClicked === 'Current Location') {
            content = showDiv;
        }
        if(isClicked === 'Search' && clickedSupermarket.clicked ===false){
            content = 
                <SupermarketSearch 
                    title="Search Supermarkets" 
                    setSupermarkets = {props.setSupermarkets} 
                    getOffers={props.getOffers} 
                    setOffers={props.setOffers}
                    isClicked={isClicked}
                />
        }
        else if(isClicked === 'Categories'){
            
            axios.get('http://localhost:5000/categories').then(response =>{ 
                setCategories(response.data);
            })

            content = 
                <>
                    <div className="createOffer_txt">Categories</div>
                    <div className="categories_container">
                        {categories!==null ? 
                            (
                                categories.map(category => (
                                    <div
                                        key={category.name}
                                        className="cat"
                                        style={{ backgroundColor: clickCat === category.id || catHovered===category.id ? "rgba(80, 79, 79, 0.75)": "transparent"}}
                                        onMouseEnter={()=>{
                                            setCatHovered(category.id);
                                        }}
                                        onMouseLeave={()=>{
                                            setCatHovered(null);
                                        }}
                                        onClick={()=>{
                                            handleOfferCategory(category.id)
                                        }}
                                    >
                                        <div>{category.name}</div> 
                                    </div>
                                ))
                                
                            )
                            :""
                        }
                    </div>
                </>
        }
        else{
            content = showDiv;
        }

    return (
        <motion.div className="secondNavbar"
            animate={animate}
        >

            {/*{show===true ? showDiv : <SupermarketSearch title="Search Supermarkets" setSupermarkets = {props.setSupermarkets} getOffers={props.getOffers} setOffers={props.setOffers}/>}
            {clickedSupermarket.clicked===true ? showDiv : ""}*/}
            {content}
        </motion.div>
    );
}

export default SecondNavbar;