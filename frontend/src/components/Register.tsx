import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Link } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const response = await axios.post('/api/auth/register', { username, email, password, phoneNumber }, {
        headers: { 'Content-Type': 'application/json' },
      });
      console.log('Registered:', response.data);
      // Перенаправляем на страницу входа после успешной регистрации
      navigate('/login');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Box sx={{ p: 3, backgroundColor: 'secondary.main', borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom align="center" color="primary">Create Account</Typography>
        
        {/* Поле для ввода имени пользователя */}
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        
        {/* Поле для ввода email */}
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        
        {/* Поле для ввода пароля */}
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        
        {/* Поле для ввода номера телефона */}
        <TextField
          label="Phone Number"
          variant="outlined"
          fullWidth
          margin="normal"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        
        {/* Кнопка регистрации */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleRegister}
          fullWidth
          sx={{ mt: 2 }}
        >
          Register
        </Button>
        
        {/* Ссылка на страницу входа для уже зарегистрированных пользователей */}
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="textSecondary">
            Already have an account?{' '}
            <Link href="/login" underline="hover" sx={{ color: 'primary.main' }}>
              Sign in
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Register;
