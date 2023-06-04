import React, { useState, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import { TextField, Button, Grid, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom';

const LoginPage = () => { // 
  const { setUser } = useContext(AuthContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState(''); 
  const [error, setError] = useState('');
  
  const navigate = useNavigate();


  const login = async () => {
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) {
        throw new Error('Login failed'); 
      }

      const data = await res.json();

      setUser(data.payload.user); 
      navigate("/app");

    } catch (err) {
      setError(err.message); // 
    }
  };


  return (
    <Grid 
    container 
    direction="row"
    justifyContent="center"
    alignItems='center'
    style={{height: '100vh'}}
    >
      
      <Grid container direction="column" justifyContent="center" alignItems="center" spacing={2}>
      <Grid item>
        <Typography variant="h4">Login</Typography>
      </Grid>
      <Grid item>
        <TextField label="Email" value={email} onChange={e => setEmail(e.target.value)} />
      </Grid>
      <Grid item>
        <TextField label="Password" value={password} onChange={e => setPassword(e.target.value)} type="password" />
      </Grid>
      {error && (
        <Grid item>
          <Typography variant="body1" color="error">{error}</Typography>
        </Grid>
      )}
      <Grid item>
        <Button variant="contained" onClick={login}>Login</Button>
      </Grid>
      <Grid item>
  <Button variant="outlined" onClick={() => navigate("/register")}>Register</Button>
</Grid>
    </Grid>
    </Grid>
  );
};

export default LoginPage;
