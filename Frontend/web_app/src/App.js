// src/App.js

import React, { useState } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import ColaboradorPage from './pages/ColaboradorPage';
import AtividadePage from './pages/AtividadePage';
import Navbar from './components/Navbar';
import Login from './components/Authentication/Login';
import Register from './components/Authentication/Register';

function App() {

  // Estado para verificar se o user está autenticado ou não
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('access_token'));

  // Função para autenticar o user
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  // Função para desautenticar o user
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsLoggedIn(false);
  };


  // Todas as rotas têm de estar loggedIn para serem acessíveis
  // Caso o user tente aceder à rota '.../atividades' sem estar autenticado, é redirecionado para a rota principal ('/')
  return (
    <BrowserRouter>
      <div className="App">
        {isLoggedIn && <Navbar onLogout={handleLogout} />}
        <Routes>
          <Route path="/" element={ isLoggedIn ? ( <Navigate to="/colaboradores" />) : (<Login onLogin={handleLogin}/> )} />
          <Route path="/colaboradores" element={isLoggedIn ? <ColaboradorPage /> : <Navigate to="/" />} />
          <Route path="/atividades" element={isLoggedIn ? <AtividadePage /> : <Navigate to="/" />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
