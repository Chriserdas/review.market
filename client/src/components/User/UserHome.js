import {React,useEffect,useState} from 'react'
import MapCurrentLocation from '../Map/MapCurrentLocation'
import Navbar from './Navbar';
import SecondNavbar from "./SecondNavbar";
import MapContainer from './MapContainer';
import NavbarContext from './NavbarContext';
import ShopClickedContext from './ShopClickedContext';


function UserHome() {
    const [isClicked, setIsClicked] = useState("Current Location");
    const [showProduct,setShowProduct] = useState({
        show:false,
        data:null
    });


    return (
        <ShopClickedContext.Provider value = {{showProduct,setShowProduct}}>
        <NavbarContext.Provider  value ={{isClicked,setIsClicked}}>
            <div className = "mainContent_container">
                {console.log(showProduct)}
                <Navbar/>
                <SecondNavbar open={showProduct.show}/>
                <MapContainer isClicked={isClicked} setClicked={setIsClicked} productInfo={showProduct}/>
            </div>
            
        </NavbarContext.Provider>
        </ShopClickedContext.Provider>
    );
}

export default UserHome;
