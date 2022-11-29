import React from "react"
import SuperMarketButton from "./SuperMarketButton.js"
import LoginButton from "./LoginButton.js"
import ProductsButton from "./ProductsButton.js"

function Navbar() {

    return (
        <div className="front-nav-bar">
            
            <div className="title">
                <div className="title">e-consumer</div>
            </div>
            
            <div className="NavButtons">
                <SuperMarketButton></SuperMarketButton>
                <ProductsButton></ProductsButton>
                <LoginButton></LoginButton>
            </div>
            
        </div>
    );
    
}

export default Navbar;

