import React, {useState, useEffect, useRef} from 'react'
import { Link } from 'react-router-dom';
import user_image from '../../images/user_image.png';
import settings from '../../images/settings.png';
import marker from '../../images/marker.png';
import searchbar from '../../images/search-bar.png';
import current_location from '../../images/current_location.png';
import {motion,useAnimation} from "framer-motion";

/*function Navbar() {
    const handleLogout = () => {
        localStorage.clear();
        window.location.pathname = "/";
    }

    const [open,setOpen] = useState(false);

    let menuRef = useRef();

    useEffect( ()=> {
        let handler = (e)=>{
            //return true if the event.target is inside of the menuRef of false if it is outside
            if(!menuRef.current.contains(e.target)){
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return() => {
            document.removeEventListener("mousedown", handler);
        }
    });
    return (
        <div className="navbar">
            <div className="menu-container" ref={menuRef}>
                <div className="nav-title">
                    <h3>The review <br/><span>Marketplace</span></h3>
                </div>
                <div className="menu-trigger" onClick={()=>{setOpen(!open)}}>
                    <img src={user_image} alt=""></img>
                </div>
    
                <div className={`dropdown-menu ${open ? 'active': 'inactive'}`}>
                    <h3>The review <br/><span>Marketplace</span></h3>
                    <ul>
                        <li className='menu-item'>
                            <Link to='/UserHome' className='menu-links'>
                                <img className="menu-icons" src={marker} alt=""></img>
                                <i className='text-link' />Current location
                            </Link>
                        </li>
                        <li className='menu-item'>
                            <Link to='/SearchPOIs' className='menu-links'>
                                <img className="menu-icons" src={searchbar} alt=""></img>
                                <i className='text-link' />Search POIs
                            </Link>
                        </li>
                        <li className='menu-item'>
                            <Link to='/ProfileSettings' className='menu-links'>
                                <img className="menu-icons" src={settings} alt=""></img>
                                <i className='text-link' />Profile Settings
                            </Link>
                        </li>
                        <li className='menu-item'>
                            <button className='logout-btn' onClick={handleLogout}>Logout</button>
                        </li>
                    </ul>
                </div>
    
            </div>
        </div>
    );
}*/

const Navbar = ()=>{

    const [ishovered,setHover] = useState(false);
    const animateDiv = useAnimation();
    const animateText = useAnimation();
    useEffect(()=>{
        if (ishovered) {
            animateDiv.start({
                x:-50,
            });

            animateText.start({
                display: "block",
                x:-97
            });
        }

        if(!ishovered) {
            animateDiv.start({
                x:0,
            });

            animateText.start({
                display:"none",
                x:0
            });
        }
    },[ishovered]);

    return (
        <>
            <div className = "navbar">
                <div className = "navbar_buttons_container">

                    <motion.div className = "current_location_container"
                        onMouseEnter={()=>{
                            setHover(true);
                        }}
                        onMouseLeave={()=>{
                            setHover(false);
                        }}

                        animate = {animateDiv}
                    > 
                        <img src={current_location} alt=""/>
                        <motion.div className = "current_location_name"
                            animate = {animateText}
                        >Current location
                        </motion.div> 


                    </motion.div>

                </div> 

            </div>
        </>
    );
}
export default Navbar