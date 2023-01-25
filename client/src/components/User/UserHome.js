import {React,useEffect,useState} from 'react'
import MapCurrentLocation from '../Map/MapCurrentLocation'
import Navbar from './Navbar';
import SecondNavbar from "./SecondNavbar";
import MapContainer from './MapContainer';
import NavbarContext from './NavbarContext';
import ShopClickedContext from './ShopClickedContext';
import SupermarketContext from './SupermarketContext';
import SupermarketsCon from './SupermarketsCon';
import ProfileSettings from './ProfileSettings';


function UserHome() {
    const [isClicked, setIsClicked] = useState("Current Location");
    const [showProduct,setShowProduct] = useState({
        show:false,
        data:null
    });

    const [offers,setOffers] = useState(null);
    const [supermarkets,setSupermarkets] = useState(null);

    const [clickedSupermarket,setClickedSupermarket] = useState({
                                                                    clicked:false,
                                                                    name:"",
                                                                    id:"",
                                                                })
    useEffect(()=>{
        if(showProduct.show === true) {
            setIsClicked("Current Location");
            setClickedSupermarket({
                                    clicked:false,
                                    name:showProduct.super_name,
                                    id:showProduct.supermarket_id,
                                    isNear:showProduct.isNear
                                })
        }
    },[showProduct])


    return (
        <SupermarketsCon.Provider value={{supermarkets,setSupermarkets}}>
        <SupermarketContext.Provider value={{clickedSupermarket,setClickedSupermarket}}>
        <ShopClickedContext.Provider value = {{showProduct,setShowProduct}}>
        <NavbarContext.Provider  value ={{isClicked,setIsClicked}}>
            <div className = "mainContent_container">
                {isClicked !=='Settings' && isClicked !=='Admin'? 
                    (
                        <>
                            <Navbar/>
                            <SecondNavbar productInfo={showProduct} isClicked={isClicked}  setClicked={setIsClicked}  getSupermarket={clickedSupermarket} setClickedSupermarket={setClickedSupermarket} setSupermarkets={setSupermarkets} getOffers ={offers} setOffers={setOffers}/>
                            <MapContainer isClicked={isClicked} setClicked={setIsClicked} productInfo={showProduct} setShowProduct={setShowProduct} getOffers={offers} setOffers={setOffers}/>
                        </>
                    ):
                    <>
                        <Navbar/>
                        <ProfileSettings isClicked={isClicked}/>
                    </>
                }

            </div>
            
        </NavbarContext.Provider>
        </ShopClickedContext.Provider>
        </SupermarketContext.Provider>
        </SupermarketsCon.Provider>
    );
}

export default UserHome;
