import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Link } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      // Определяем, какой параметр использовать для входа: email или phoneNumber
      const loginData = email ? { email, password } : { phoneNumber, password };
      
      const response = await axios.post('/api/auth/login', loginData, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });

      console.log('Logged in:', response.data);
      // Перенаправляем на главную страницу после успешного входа
      navigate('/dashboard');  // Замените '/dashboard' на путь, куда нужно перенаправить
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Box sx={{ p: 3, backgroundColor: 'secondary.main', borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom align="center" color="primary">Sign In</Typography>

        {/* Поле для ввода email или телефона */}
        <TextField
          label="Email or Phone Number"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email || phoneNumber}  // Значение по умолчанию - email или phoneNumber
          onChange={(e) => {
            const value = e.target.value;
            // Если это похоже на email, обновляем email, иначе phoneNumber
            if (value.includes('@')) {
              setEmail(value);
              setPhoneNumber('');
            } else {
              setPhoneNumber(value);
              setEmail('');
            }
          }}
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

        <Button
          variant="contained"
          color="primary"
          onClick={handleLogin}
          fullWidth
          sx={{ mt: 2 }}
        >
          Login
        </Button>

        {/* Кнопка для перехода на страницу регистрации, если у пользователя нет аккаунта */}
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="textSecondary">
            Don't have an account?{' '}
            <Link href="/register" underline="hover" sx={{ color: 'primary.main' }}>
              Sign up
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;