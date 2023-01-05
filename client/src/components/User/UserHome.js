import {React,useEffect,useState} from 'react'
import MapCurrentLocation from '../Map/MapCurrentLocation'
import Navbar from './Navbar';
import SecondNavbar from "./SecondNavbar";
import MapContainer from './MapContainer';
import NavbarContext from './NavbarContext';


function UserHome() {
    const [isClicked, setIsClicked] = useState("Current Location");
    
    return (
        <NavbarContext.Provider  value ={{isClicked,setIsClicked}}>
            <div className = "mainContent_container">
                
                <Navbar/>
                <MapContainer isClicked={isClicked} />
            </div>
        </NavbarContext.Provider>
    );
}

export default UserHome;
