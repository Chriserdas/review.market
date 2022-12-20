import React from 'react'
import MapCurrentLocation from '../Map/MapCurrentLocation'
import Navbar from './Navbar';


function UserHome() {
    return (
        <div>
            <Navbar/>
            <MapCurrentLocation/>
        </div>
    )
}

export default UserHome