// src/components/Authentication/Register.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../css/Register.css';
import axios from 'axios';

const Register = () => {
  const [username, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Função para atualizar o estado do email, password e confirmPassword
  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
    if (name === 'confirmPassword') setConfirmPassword(value);
  };

  // Função que realiza um pedido HTTP Post com os dados à API para registar o user
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verificar se as passwords coincidem.
    if (password !== confirmPassword) {
      setErrorMessage('Passwords dont match. Please try again.');
      return;
    }
    
    try {
      const response = await axios.post('http://localhost:8000/api/register/', {
        username,
        password,
      });
      
      if (response.status === 201) {
        // Armazenar os tokens de acesso e de atualização no localStorage
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        // Redirecionar o user para a página de colaboradores
        navigate('/colaboradores'); 
      } else {
        throw new Error('Error registering. Please try again.');
      }
    } catch (error) {
      console.log('Error:', error); 
      // Apresentar a devida mensagem de erro ao user
      if (error.response && error.response.data && error.response.data.username) {
        setErrorMessage(error.response.data.username[0]);
      } else {
        setErrorMessage('Error registering. Please try again.');
      }
    }
  };


  return (
    <div className="register-container">
      <div className="register-card">
        <h1 className="register-title">Register</h1>
        {errorMessage && <div className="register-error">{errorMessage}</div>}
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
          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password:</label>
            <input
              type="password"
              className="form-control"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="register-button">Register</button>
        </form>
        <p className="register-login">
          Already a member? <Link to="/login" className="login-link">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;