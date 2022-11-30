import React from "react"
import SuperMarketButton from "./SuperMarketButton.js"
import LoginButton from "./LoginButton.js"
import ProductsButton from "./ProductsButton.js"
import LoginForm from "./LoginForm.js"

function Navbar() {
    return (
        <div className="front-nav-bar">
            
            <div className="Title"><i class="uil uil-shopping-cart"></i>review </div>

            <div className="NavButtons">
                <SuperMarketButton></SuperMarketButton>
                <ProductsButton></ProductsButton>
            </div>

            <div className="LoginButton">
                <LoginButton ></LoginButton>
            </div>
            
        </div>
    );
    
}

export default Navbar;