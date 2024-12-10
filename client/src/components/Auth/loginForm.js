import React, { useState, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import styles from "../Auth/styles/Login.module.css";
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
    <form className={styles["login-container"]} onSubmit={login}>
      <div className={styles['box-1']}>
        <div className={styles['box-1-logo']}>
          <img
            src={instagramLogo}
            alt="Instagram Logo"
            className={styles['instagram-logo']}
          />
        </div>
        <div className={styles['input-box']}>
          <input
            type="text"
            placeholder="user@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className={styles['input-box']}>
          <input
            type="password"
            placeholder="pass1234"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className={styles['error']}>{error}</p>}
        <div className={styles['login-button-box']}>
          <button type="submit" className={styles['login-button']}>
            Login
          </button>
        </div>
        <div className={styles['lines-box']}>
          <div className={styles['line-1']}></div>
          <div className={styles['or-box']}>OR</div>
          <div className={styles['line-2']}></div>
        </div>
        <div className={styles['forgotten-password-box']}>
          <p className={styles['forgotten-password-link']}>Forgotten your password?</p>
        </div>
      </div>
      <div className={styles['box-2']}>
        <p>
          Don't have an account?{" "}
          <span className={styles['sign-up-span']} onClick={() => navigate("/register")}>
            Sign up
          </span>
        </p>
      </div>
    </form>
  );
};

export default LoginPage;