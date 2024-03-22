// src/Login.js
import React, { useState } from 'react';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom'; // For redirecting to another route
import { useAuth } from './AuthContext'; // Import the useAuth hook
import { TextField, Button, Container, Typography, Alert } from '@mui/material';
const url = "https://seample-server-1606ba33c892.herokuapp.com";
// const url = "http://localhost:3001";

function Login() {
    const [accountName, setAccountName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
  
    const navigate = useNavigate();
    const { login } = useAuth(); // Destructure the login function from the context
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
  
      try {
        const response = await Axios.post(url+'/login', {
          user_account: accountName, 
          user_password: password
        });
  
        // Assuming your backend sends a specific message on successful login
        if (response.data.message === 'Login successful') {
          const user_role = response.data.role;
          const user_email = response.data.email;
          login(accountName, user_role, user_email); // Update the auth context state to indicate the user is logged in
          navigate('/'); // Redirect to the homepage or another protected route
        } else {
          setError('Invalid credentials');
        }
      } catch (error) {
        setError('Login failed');
      }
    };
  
    return (
      <Container component="main" maxWidth="xs">
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="帳戶名稱"
            autoFocus
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="密碼"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            登入
          </Button>
        </form>
      </Container>
    );
  }

export default Login;