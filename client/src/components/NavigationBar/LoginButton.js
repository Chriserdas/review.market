import React from "react";
import Login from "./Login.js"
import "./login.css"

function LoginButton({handleLoginClick}){
    const [isShown, setIsShown] = React.useState(false);

    const handleClick = event => {
        setIsShown(current => !current);

      };
    return (
        <div> 
            <button onClick={handleClick} className="LoginButton">Sign in</button>

            {isShown && <Login />}
        </div>
    );
    
}

export default LoginButton;