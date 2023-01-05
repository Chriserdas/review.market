import React from 'react'
import MapCurrentLocation from '../Map/MapCurrentLocation'
import Navbar from './Navbar';
import SecondNavbar from "./SecondNavbar";
import MapContainer from './MapContainer';


function UserHome() {
    /*return (
        <div>
            <Navbar/>
            <MapCurrentLocation/>
        </div>
    )*/

    return (
        <>
            <div className = "mainContent_container">
                <Navbar/>
                <SecondNavbar/>
                <MapContainer/>

            </div>
        </>
    );
}

export default UserHome;