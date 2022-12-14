import React,{ useState}  from "react";
import axios from "axios";

const AuthenticateForm = (props)=>{

    const [data, setData] = useState({
		username: "",
		email: "",
		password: "",
	});
    const[title,setTitle] = useState(props.title);
    const[top,setTop]= useState(props.goToRegisterTop);
    const[goTo,setGoTo] = useState(props.goTo);
    const[displayUsername,setDisplayUsername] = useState(props.displayUsername);
    
    const [error, setError] = useState("");

    const handleChange = ({ currentTarget: input }) => {
		setData({ ...data, [input.name]: input.value });
	};

    const handleSubmit = async(e) => {
        e.preventDefault()
        if(title === "Log in"){
            try {
                const url = "http://localhost:5000/api/auth";
                const { data: res } = await axios.post(url, data);
                localStorage.setItem("token", res.data);
                window.location = "/";
            } catch (error) {
                if (
                    error.response &&
                    error.response.status >= 400 &&
                    error.response.status <= 500
                ) {
                    setError(error.response.data.message);
                }
            }
        }
        else if(title === "Register"){
            try {
                const url = "http://localhost:5000/api/users";
                const { data: res } = await axios.post(url, data);
                console.log(res.message);
            } catch (error) {
                if (
                    error.response &&
                    error.response.status >= 400 &&
                    error.response.status <= 500
                ) {
                    setError(error.response.data.message);
                }
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
        <div className="authenticate-form-container" >
            <div className="sign_in_title">{title}</div>
            <form className="authenticate-form" onSubmit={handleSubmit}>
                <input 
                    value={data.email}
                    type="email"
                    onChange={handleChange}
                    placeholder="Email address"
                    id="email"
                    name="email"
                />
                 <input
                    value={data.username}
                    type="username"
                    onChange={handleChange}
                    placeholder="Username"
                    id="username"
                    name="username"
                    style={{display:displayUsername}}
                />
                 <input
                    value={data.password}
                    type="password"
                    onChange={handleChange}
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