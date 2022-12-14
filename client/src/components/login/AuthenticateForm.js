import React,{ useState}  from "react";

const AuthenticateForm = (props)=>{
    

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const[title,setTitle] = useState(props.title);
    const[top,setTop]= useState(props.goToRegisterTop);
    const[goTo,setGoTo] = useState(props.goTo);
    const[displayUsername,setDisplayUsername] = useState(props.displayUsername);


    const handleSubmit = async (e) => {
		e.preventDefault();
	};

    const register = (e) => {
        if(title === "Log in"){
            setTitle("Register");
            setTop("100px");
            setGoTo("Log in");
            setDisplayUsername("block");
        }
        else if(title === "Register"){
            setTitle("Log in");
            setTop("110px");
            setGoTo("Register");
            setDisplayUsername("none");
        }
    }
    
    

    return (
        <div className="authenticate-form-container" >
            <div className="sign_in_title">{title}</div>
            <form className="authenticate-form" onSubmit={handleSubmit}>
                <input 
                    defaultValue={email}
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    id="email"
                    name="email"
                />
                 <input
                    defaultValue={username}
                    type="username"
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    id="username"
                    name="username"
                    style={{display:displayUsername}}
                />
                 <input
                    defaultValue={password}
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    id="pass"
                    name="password"
                />
                <button
                    className="login_btn"
                    type="submit"
                >{title}</button>
            </form>
            <div className="goToRegister_container" style={{top:top}}>            
                <div className="goToRegister">Dont have an account?</div>
                <button className="register_btn" onClick={register}>{goTo}</button>
            </div>
        </div>
    );
}

export default AuthenticateForm;