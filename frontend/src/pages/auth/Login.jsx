import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, TextField, Typography, FormControlLabel, Checkbox } from '@mui/material';
import axios from './api';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/auth/login/', {
        email: formData.email,
        password: formData.password
      });
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userType', response.data.userType);
      
      if (formData.rememberMe) {
        localStorage.setItem('rememberedEmail', formData.email);
      }
      
      navigate(response.data.userType === 'barber' ? '/barber/dashboard' : '/customer/dashboard');
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Sign In to BarberConnect
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
        <TextField
          fullWidth
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
          sx={{ mb: 2 }}
        />
        
        <TextField
          fullWidth
          label="Password"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          required
          sx={{ mb: 2 }}
        />
        
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.rememberMe}
              onChange={(e) => setFormData({...formData, rememberMe: e.target.checked})}
            />
          }
          label="Remember me"
          sx={{ mb: 2 }}
        />
        
        <Button
          fullWidth
          variant="contained"
          type="submit"
          sx={{ py: 2 }}
        >
          Sign In
        </Button>
        
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Button onClick={() => navigate('/forgot-password')}>Forgot Password?</Button>
          <Button onClick={() => navigate('/signup/customer')}>Create Account</Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;