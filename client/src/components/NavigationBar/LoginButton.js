import React from "react";
import LoginForm from "./LoginForm.js"

function LoginButton({handleLoginClick}){
    const [isShown, setIsShown] = React.useState(false);

    const handleClick = event => {
        setIsShown(current => !current);

      };
    return (
        <div> 
            <button onClick={handleClick} className="LoginButton">Sign in</button>

            {isShown && <LoginForm />}
        </div>
    );
    
}

export default LoginButton;