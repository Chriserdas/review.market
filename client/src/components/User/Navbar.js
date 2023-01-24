import React, {useState, useEffect, useRef, useContext} from 'react'
import { Link } from 'react-router-dom';
import current_location from '../../images/current_location.png';
import categories from '../../images/categories.png';
import settings from '../../images/setting.png';
import logo from '../../images/logo.png';
import admin from '../../images/admin.png';
import search from '../../images/search.png'
import NavbarButton from './NavbarButton';
import MapContainer from './MapContainer';
import NavbarContext from './NavbarContext';


const Navbar = ()=>{

    const {isClicked, setIsClicked} = useContext(NavbarContext);  
    const user = JSON.parse(localStorage.getItem("token")).user

    const handleClick = (name)=>{
        setIsClicked(name);
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

                {user.isAdmin === true ?
                    (
                        <div className= "wrapper" onClick ={()=> handleClick("Admin")}>
                            <NavbarButton
                                imgSrc = {admin}
                                text = "Admin"
                                clicked = {isClicked}
                            />
                        </div>
                    )
                    :""
                }

                <div 
                    className='logout'
                    onClick={()=> window.location ='/'}
                >Logout</div>   

            </div>
        </>
    );
}
export default Navbar