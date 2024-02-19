import React, { useState, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import "../Auth/styles/Login.css";
import instagramLogo from "../../assets/instagram-text-icon.png";

const LoginPage = () => {
  const { setUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const login = async (event) => {
    event.preventDefault();
    try {
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error("Login failed");
      const { user: userData } = await res.json();
      setUser(userData);
      navigate("/feed");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form className="login-container" onSubmit={login}>
      <div className="box-1">
        <div className="box-1-logo">
          <img
            src={instagramLogo}
            alt="Instagram Logo"
            className="instagram-logo"
          />
        </div>
        <div className="input-box">
          <input
            type="text"
            placeholder="user@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="input-box">
          <input
            type="password"
            placeholder="pass1234"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className="error">{error}</p>}
        <div className="login-button-box">
          <button type="submit" className="login-button">
            Login
          </button>
        </div>
        <div className="lines-box">
          <div className="line-1"></div>
          <div className="or-box">OR</div>
          <div className="line-2"></div>
        </div>
        <div className="forgotten-password-box">
          <p className="forgotten-password-link">Forgotten your password?</p>
        </div>
      </div>
      <div className="box-2">
        <p>
          Don't have an account?{" "}
          <span className="sign-up-span" onClick={() => navigate("/register")}>
            Sign up
          </span>
        </p>
      </div>
    </form>
  );
};

export default LoginPage;
