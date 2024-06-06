import React, { useState, useContext } from "react";
import { AuthContext } from "./AuthContext";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Box,
  Paper,
  Avatar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

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
    birthdate: new Date(),
    profileImage: null,
  });

  const [error, setError] = useState("");
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    if (e.target.name === "profileImage") {
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
    setFormData({
      ...formData,
      [e.target.name]: e.target.files ? e.target.files[0] : e.target.value,
    });
  };

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      birthdate: date,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    try {
      const res = await fetch("/api/users/signup", {
        method: "POST",
        body: data,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "signup failed");
      }

      const { user: userData } = await res.json();

      setUser(userData);
      navigate("/feed");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        backgroundImage: "linear-gradient(to right, #e0f7fa, #e0f2f1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          width: "600px",
          borderRadius: 2,
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          marginTop: "2rem",
        }}
      >
        <form onSubmit={handleSubmit}>
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            spacing={2}
          >
            <Grid item xs={12}>
              <Typography
                variant="h4"
                style={{ fontFamily: "Pacifio, cursive" }}
              >
                Register
              </Typography>
            </Grid>
            <Grid
              item
              container
              direction="row"
              justifyContent="center"
              alignItems="flex-start"
              spacing={2}
            >
              <Grid
                item
                xs={4}
                container
                direction="column"
                justifyContent="space-between"
                alignItems="center"
                spacing={2}
              >
                <Grid item>
                  <Avatar
                    src={preview || "https://via.placeholder.com/150"}
                    alt="Profile Preview"
                    sx={{ width: 56, height: 56 }}
                  />
                </Grid>
                <Grid item>
                  <Typography variant="body1">Upload your image</Typography>
                </Grid>
                <Grid item>
                  <Button variant="contained" component="label" fullWidth>
                    Choose Image
                    <input
                      type="file"
                      hidden
                      name="profileImage"
                      onChange={handleChange}
                    />
                  </Button>
                </Grid>
              </Grid>
              <Grid item xs={4} container direction="column" spacing={2}>
                <Grid item>
                  <TextField
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
                <Grid item>
                  <TextField
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
                <Grid item>
                  <TextField
                    label="Username"
                    name="userName"
                    value={formData.userName}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
              </Grid>
              <Grid item xs={4} container direction="column" spacing={2}>
                <Grid item>
                  <TextField
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
                <Grid item>
                  <TextField
                    label="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                  />
                  <TextField
                    label="Confirm Password"
                    name="passwordConfirm"
                    type="password"
                    value={formData.passwordConfirm}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
                <Grid item>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Birthdate"
                      inputFormat="MM/dd/yyyy"
                      value={formData.birthdate}
                      onChange={handleDateChange}
                    >
                      {(params) => (
                        <TextField {...params} fullWidth variant="outlined" />
                      )}
                    </DatePicker>
                  </LocalizationProvider>
                </Grid>
                {error && (
                  <Grid item>
                    <Typography variant="body1" color="error">
                      {error}
                    </Typography>
                  </Grid>
                )}
                <Grid item>
                  <Button
                    variant="contained"
                    type="submit"
                    fullWidth
                    color="primary"
                  >
                    Register
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default RegisterPage;
