import { useState } from 'react';
import axios from 'axios'
import "./login.css"

function Login(props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isValid, setIsvalid] = useState(true);
    const [state, setState] = useState([])

    function submitHandler(e) {
        e.preventDefault();

        if (email.length === 0 || password.length === 0) {
            setIsvalid(false);
        }
        else {
            const logindata = {
                email: email,
                password: password
            }
            axios.post('http://localhost:3001/Login', logindata).then(res => setState(res.data));
            setEmail("");
            setPassword("");
        }
    }
    return (
        <div>

            <form onSubmit={submitHandler}>
                <h1>Sign In As Customer</h1>
                <div>
                    <input type="email"
                        value={email}
                        onChange={(e) => {
                            if (email.length > 0) {
                                setIsvalid(true)
                            }
                            setEmail(e.target.value)
                        }}
                        placeholder="Email Address"
                        style={{ borderColor: isValid ? "#ffff" : "#ff0000" }} />
                </div>
                <div>
                    <input type="password"
                        value={password}
                        onChange={(e) => {
                            if (password.length > 0) {
                                setIsvalid(true)
                            }
                            setPassword(e.target.value)
                        }}
                        placeholder="Password"
                        style={{ borderColor: isValid ? "#ffff" : "#ff0000" }} />
                </div>
                <div>
                    <h5 style={{ color: "red", fontSize: "1em" }}>{state}</h5>
                </div>
                <input type='submit'
                    value='Login'
                    style={{ backgroundColor: "#377df1", color: "white" }} />
            </form>
            <br />
            <span>Are you an Admin?</span> &nbsp;  &nbsp; &nbsp;
            <button className="login-btn-user" onClick={props.change} style={{ backgroundColor: "#377df1", color: "white" }}>Login As Admin</button>
        </div>
    )
}
export default Login;