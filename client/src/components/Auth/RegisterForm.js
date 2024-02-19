import React, { useState, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import "../Auth/styles/SignUp.css"; // Ensure this CSS is styled similarly to your login CSS
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
    <div className="signup-container">
      <form onSubmit={handleSubmit} className="signup-form">
        <div className="signup-logo">
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
        {error && <div className="signup-error">{error}</div>}
        <button type="submit" className="signup-button">Register</button>
        <div className="signup-footer">
          Already have an account? <span className="signup-link" onClick={() => navigate("/login")}>Login</span>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
