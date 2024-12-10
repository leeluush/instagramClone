import React, { useState, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { TextField, Button, Grid, Typography, Box, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const { setUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const login = async (event) => {
    event.preventDefault(); // Prevent the form from refreshing the page

    try {
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        throw new Error("Login failed");
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
          width: "300px",
          borderRadius: 2,
          backgroundColor: "rgba(255, 255, 255, 0.8)",
        }}
      >
        <form onSubmit={login}>
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            spacing={2}
          >
            <Grid item>
              <Typography
                variant="h4"
                style={{ fontFamily: "Pacifio, cursive" }}
              >
                Login
              </Typography>
            </Grid>
            <Grid item>
              <TextField
                label="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item>
              <TextField
                label="pass1234"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                fullWidth
                variant="outlined"
              />
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
                Login
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                onClick={() => navigate("/register")}
                fullWidth
              >
                Register
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default LoginPage;
