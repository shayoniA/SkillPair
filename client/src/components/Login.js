import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../assets/styles.css";
import i3 from "../assets/logoi2.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/login", { email, password });
      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", response.data.userId);
        navigate("/home");
        console.log('Sender: ', response.data.userId);
      } else
        setError(response.data.message);
    } catch (err) {
      setError("Login failed. Please check your email and password.");
    }
  };

  return (
    <div><img src={i3} className="logoimg2" />
    <div className="shortenerrorloginpage"></div>
    <div className="wholeloginpage">
      <div className="login-container">
        <h2 className="loginhead">Welcome back!</h2>
        <p className="loginwith">Log in with:</p>
        {error && <p className="errorinlogin">{error}</p>}
        <form onSubmit={handleLogin}>
          <div>
            <input className="inplogin"
              type="email" placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <input className="inplogin inppwdlogin"
              type="password" placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="loginbtninloginpage" type="submit">Login</button>
        </form>
      </div>
      <div className="signuppartinloginpage">
        <h2 className="signuphead">New here?</h2>
        <p className="donthave">Don't have an account?</p>
        <p className="createone">Create one.</p>
        <button className="createaccountbtn" onClick={() => navigate("/register")}>Create account</button>
      </div>
      </div>
    </div>
  );
};

export default Login;
