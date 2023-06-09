import { useState, useContext } from 'react';
import { Grid } from '@mui/material';
import { AuthContext } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import LoginForm from './LoginForm';

const LoginPage = () => { 
  const { setUser } = useContext(AuthContext);
  const [email, setEmail] = useState('');
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
      setError(err.message); 
    }
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  return (
    <Grid 
      container 
      direction="row"
      justifyContent="center"
      alignItems='center'
      style={{height: '100vh'}}
    >
      <LoginForm
        email={email}
        password={password}
        error={error}
        onEmailChange={(e) => setEmail(e.target.value)}
        onPasswordChange={(e) => setPassword(e.target.value)}
        onLogin={login}
        onRegister={handleRegisterClick}
      />
    </Grid>
  );
};

export default LoginPage;
