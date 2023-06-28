import React, { useState, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { TextField, Button, Grid, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => { 
    const { setUser } = useContext(AuthContext)
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        userName: '',
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        birthdate: '',
        profileImage: null
    });

    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.files ? e.target.files[0] : e.target.value
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const data = new FormData();
        Object.keys(formData).forEach((key) => {
            data.append(key, formData[key]);
        });
        console.log('formData:', formData);


        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                body: data 
            });
  
            if (!res.ok) {
                const errorData = await res.json();
                console.log('Error data from server:', errorData);

                throw new Error(errorData.message || 'Registration failed');
            }
  
            const user = await res.json();
            setUser(user);
            navigate("/feed");
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <Grid container direction="row" justifyContent="center" alignItems='center' style={{height: '100vh'}}>
            <Grid container direction="column" justifyContent="center" alignItems="center" spacing={2}>
                <Grid item>
                    <Typography variant="h4">Register</Typography>
                </Grid>
                <Grid item>
                    <TextField label="Username" name="userName" value={formData.userName} onChange={handleChange} />
                </Grid>
                <Grid item>
                    <TextField label="Email" name="email" value={formData.email} onChange={handleChange} />
                </Grid>
                <Grid item>
                    <TextField label="Password" name="password" type="password" value={formData.password} onChange={handleChange} />
                </Grid>
                <Grid item>
                    <TextField label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} />
                </Grid>
                <Grid item>
                    <TextField label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} />
                </Grid>
                <Grid item>
                    <TextField label="Birthdate" name="birthdate" type="date" value={formData.birthdate} onChange={handleChange} InputLabelProps={{ shrink: true }} />
                </Grid>
                <Grid item>
                    <Button variant="contained" component="label">
                        Upload Profile Image
                        <input type="file" hidden name="profileImage" onChange={handleChange} />
                    </Button>
                </Grid>
                {error && (
                    <Grid item>
                        <Typography variant="body1" color="error">{error}</Typography>
                    </Grid>
                )}
                <Grid item>
                    <Button variant="contained" onClick={handleSubmit}>Register</Button>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default RegisterPage;