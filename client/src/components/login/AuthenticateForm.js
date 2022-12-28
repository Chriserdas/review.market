import React,{ useEffect, useState}  from "react";
import axios from 'axios';
import NotificationPopup from "../NotificationPopup";


const AuthenticateForm = (props)=>{
    
    localStorage.clear();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [title,setTitle] = useState(props.title);
    const [top,setTop]= useState(props.goToRegisterTop);
    const [goTo,setGoTo] = useState(props.goTo);
    const [displayUsername,setDisplayUsername] = useState(props.displayUsername);
    const [serverResponse,setServerResponse] = useState({
        message: "",
        color: "",
        open: false
    });
    const [info,setInfo] = useState({
        isAuth:false,
        data:"",
        page:""
    });

   useEffect(()=>{
    
    if(serverResponse.open){
        const timeout = setTimeout(()=>{

            if(info.isAuth){
                localStorage.setItem("isAuthenticated", "true");
                localStorage.setItem('token',info.data);
            }
            window.location = info.page;
        }, 3000);
        return () => clearTimeout(timeout);
    }
   },[info.page,serverResponse.open]);

    const handleSubmit = async (e) => {
		e.preventDefault();
        if(title === "Log in"){
            const cred =  { email, password}
            axios.post("http://localhost:5000/api/auth", cred)
        .then(res => {
            if (res.data.user) {
                if(res.data.user.isAdmin){

                    setInfo({
                        isAuth:true,
                        data:res.data.user,
                        page:'/AdminHome'
                    });
                    setServerResponse({
                        message :"Login Successful!",
                        color:"green",
                        open:true
                    });

                }else{
                    setInfo({
                        isAuth:true,
                        data:res.data.user,
                        page:'/UserHome'
                    });
                
                    setServerResponse({
                        message :"Login Successful!",
                        color:"green",
                        open:true
                    });
                    
                
                }
            }else{
                setServerResponse({
                    message :"Please check your username and password",
                    color:"#dd3b39",
                    open:true
                });

                setInfo({
                    page:"/",
                })
            }
        })

        } else if(title === "Register"){
            const cred =  { username, email, password}
            if( username && email && password){

                try{
                    axios.post("http://localhost:5000/api/users", cred)
                .then( res => {
                    alert(res.data.message)
                    window.location = '/'
                })}
                catch(err){
                    alert(err)
                }

            } else {
                alert("invalid input")
            }   
        }
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
        <>
            <div className="authenticate-form-container" >
                <div className="sign_in_title">{title}</div>
                <div className="authenticate-form">
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
                        onClick={handleSubmit}
                    >{title}</button>
                    
                </div>
                <div className="goToRegister_container" style={{top:top}}>            
                    <div className="goToRegister">Dont have an account?</div>
                    <button className="register_btn" onClick={register}>{goTo}</button>
                </div>
            </div>  
            <NotificationPopup color ={serverResponse.color} message={serverResponse.message} activate = {serverResponse.open} />
        </>
    );
}
export default AuthenticateForm;