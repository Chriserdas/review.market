import React, { useState } from "react";

export const Login = (props) => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(email);
  };

  return (
    <div className="auth-form-container">
      <h2>Login as User</h2><br></br>
      <form className="login-form" onSubmit={handleSubmit}>
        <label htmlFor="email">User email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="youremail@gmail.com"
          id="email"
          name="email"
        />
        <label htmlFor="password">Password</label>
        <input
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          type="password"
          placeholder="********"
          id="password"
          name="password"
        />
        <button className="login-btn" type="submit">Log In</button>
      </form>
      <button
        className="link-btn"
        onClick={() => props.onFormSwitch("loginAdmin")}
      >
        Are you an admin? Login here.
      </button>
      <button
        className="link-btn"
        onClick={() => props.onFormSwitch("register")}
      >
        Need an account? Register here.
      </button>
    </div>
  );
};