import React, {useState, useEffect, useRef} from 'react'
import { Link } from 'react-router-dom';
import current_location from '../../images/current_location.png';
import categories from '../../images/categories.png';
import settings from '../../images/setting.png';
import logo from '../../images/logo.png';
import search from '../../images/search.png'
import NavbarButton from './NavbarButton';


const Navbar = ()=>{

        const [isClicked, setIsClicked] = useState("Current Location");  
        
        const handleClick = (name)=>{
            setIsClicked(name)
        }
    return (
        <>

            <div className = "navbar">

                <div className = 'logo_container'>
                    <img src = {logo} alt = ''/>
                    <div className = "logo_b"></div>
                </div>

                <div className= "wrapper" onClick ={()=> handleClick("Current Location")}>
                    <NavbarButton
                        imgSrc = {current_location}
                        text = "Current Location"
                        clicked = {isClicked}
                    />
                </div>

                <div className= "wrapper" onClick ={()=> handleClick("Search")}>
                    <NavbarButton
                        imgSrc = {search}
                        text = "Search"
                        clicked = {isClicked}
                    />
                </div>
               
                <div className= "wrapper" onClick ={()=> handleClick("Categories")}>
                    <NavbarButton
                        imgSrc = {categories}
                        text = "Categories"
                        clicked = {isClicked}
                    />
                </div>
                
                <div className= "wrapper" onClick ={()=> handleClick("Settings")}>
                    <NavbarButton
                        imgSrc = {settings}
                        text = "Settings"
                        clicked = {isClicked}
                    />
                </div>

            </div>
        </>
    );
}
export default Navbar