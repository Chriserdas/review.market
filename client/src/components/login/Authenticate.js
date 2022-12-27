import React from "react";
import NotificationPopup from "../NotificationPopup.js";
import AuthenticateForm from "./AuthenticateForm.js";


export default function Authenticate(props) {

    return (
        <div className="login_container">
            
            <div className="login-title-container">
                <div className="login_title">review</div>
                <div className="login_txt">Welcome <br></br>to The Review <br></br>Marketplace </div>
            </div>

            <div className="mapContainer">
                <AuthenticateForm 
                    title="Log in" 
                    goToRegisterTop="110px" 
                    goTo="Register"
                    displayUsername="none"
                />    
            </div>
            
        </div>
    );
}