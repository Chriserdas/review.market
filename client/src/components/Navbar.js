import React from "react"

export default function Navbar() {
    return (
        <nav className="front-nav-bar">
            <img className="logo-img" src="/images/bucket.png"></img>
            <h3 className="title">e-consumer</h3>
            <h4 className="nav-item1">SuperMarkets</h4>
            <h4 className="nav-item2">Products</h4>
            <button className="login-button">Login</button>
        </nav>
    )
}