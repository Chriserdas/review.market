import {React,useEffect,useState} from 'react'
import MapCurrentLocation from '../Map/MapCurrentLocation'
import Navbar from './Navbar';
import SecondNavbar from "./SecondNavbar";
import MapContainer from './MapContainer';
import NavbarContext from './NavbarContext';
import ShopClickedContext from './ShopClickedContext';
import SupermarketContext from './SupermarketContext';


function UserHome() {
    const [isClicked, setIsClicked] = useState("Current Location");
    const [showProduct,setShowProduct] = useState({
        show:false,
        data:null
    });

    const [clickedSupermarket,setClickedSupermarket] = useState({
                                                                    name:"",
                                                                    id:"",
                                                                })
    useEffect(()=>{
        if(showProduct.show === true) {
            setIsClicked("Current Location");
            setClickedSupermarket({
                                    name:showProduct.super_name,
                                    id:showProduct.supermarket_id
                                })
        }
    },[showProduct])


    return (
        <SupermarketContext.Provider value={{clickedSupermarket,setClickedSupermarket}}>
        <ShopClickedContext.Provider value = {{showProduct,setShowProduct}}>
        <NavbarContext.Provider  value ={{isClicked,setIsClicked}}>
            <div className = "mainContent_container">
                {console.log(showProduct)}
                {console.log(clickedSupermarket.name) }
                <Navbar/>
                <SecondNavbar productInfo={showProduct} isClicked={isClicked} setClicked={setIsClicked} supermarket_id={clickedSupermarket.id} supermarket_name={clickedSupermarket.name}/>
                <MapContainer isClicked={isClicked} setClicked={setIsClicked} productInfo={showProduct} setShowProduct={setShowProduct} />
            </div>
            
        </NavbarContext.Provider>
        </ShopClickedContext.Provider>
        </SupermarketContext.Provider>
    );
}

export default UserHome;
