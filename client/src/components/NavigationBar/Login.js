import React from "react";

const LoginForm = ( {isShowLogin} ) => {
    return (
        <div className={`${isShowLogin ? "active" : ""} show`}>
            <div className="login-form">
                <div className="form-box-solid">
                    <div>
                       <div className="login-text">Sign In</div>
                       <label>UserName</label>
                       <input
                         type="text"
                         name="username"
                         className="login-box"
                        />
                        <label>Password</label> 
                        <input
                          type="password"
                          name="password"
                          className="login-box"
                        />
                        <input type="submit" value="LOGIN" className="login-btn" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginForm;
