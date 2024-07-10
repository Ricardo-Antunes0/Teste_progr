import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../../axiosConf';
import '../../css/Login.css';

const Login = ({ onLogin }) => {
  const [username, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Função para atualizar o estado do email e password
  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
  };

  // Função que realiza um pedido HTTP Post com os dados à API para autenticar o user
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('/login/', {
        username,
        password
      });
      
      if (response.status === 200) {
        setErrorMessage('Login sucessful!');
        const data = response.data;
        // Armazenar os tokens de acesso e de atualização no localStorage
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        onLogin();
      }
    } catch (error) {
      // Apresentar a devida mensagem de erro ao user
      const errorResponse = error.response?.data?.error || 'Request failed';
      setErrorMessage(errorResponse);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Login</h1>
        {errorMessage && <p className="login-error">{errorMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email:</label>
            <input 
              type="email" 
              className="form-control" 
              id="email" 
              name="email" 
              value={username} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password:</label>
            <input 
              type="password" 
              className="form-control" 
              id="password" 
              name="password" 
              value={password} 
              onChange={handleChange} 
              required 
            />
          </div>
          <button type="submit" className="login-button">Login</button>
        </form>
        <p className="login-register">
          Not a member? <Link to="/register" className="register-link">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;