import React, { useState, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import styles from "../Auth/styles/SignUp.module.css"; // Import the CSS module
import instagramLogo from "../../assets/instagram-text-icon.png";

const RegisterPage = () => {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    passwordConfirm: "",
    firstName: "",
    lastName: "",
    birthdate: "",
    profileImage: null,
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });
    console.log("Form data before submission:", Object.fromEntries(data.entries()));

    try {
      const res = await fetch("/api/users/signup", {
        method: "POST",
        body: data,
      });

      if (!res.ok) {
        const errorResponse = await res.json();
        throw new Error(errorResponse.message || "Signup failed");
      }

      const { user: userData } = await res.json();
      setUser(userData);
      navigate("/feed");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.signupContainer}>
      <form onSubmit={handleSubmit} className={styles.signupForm}>
        <div className={styles.signupLogo}>
          <img src={instagramLogo} alt="Instagram Logo" />
        </div>
        <input
          type="text"
          placeholder="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="Username"
          name="userName"
          value={formData.userName}
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          name="passwordConfirm"
          value={formData.passwordConfirm}
          onChange={handleChange}
        />
        <input
          type="date"
          name="birthdate"
          value={formData.birthdate}
          onChange={handleChange}
        />
        <input
          type="file"
          name="profileImage"
          onChange={handleChange}
        />
        {error && <div className={styles.signupError}>{error}</div>}
        <button type="submit" className={styles.signupButton}>Register</button>
        <div className={styles.signupFooter}>
          Already have an account? <span className={styles.signupLink} onClick={() => navigate("/login")}>Login</span>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
