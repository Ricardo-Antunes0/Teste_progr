import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../css/Navbar.css';

const Navbar = ({ onLogout }) => {
  const location = useLocation();

  return (
    <div className="navbar">
      <div className="navbar-buttons">
        {location.pathname === '/colaboradores' ? (
          <>
            <Link to="/atividades" className="nav-button">Atividades</Link>
          </>
        ) : location.pathname === '/atividades' ? (
          <>
            <Link to="/colaboradores" className="nav-button">Colaboradores</Link>
          </>
        ) : null}
        <button onClick={onLogout} className="nav-button">Logout</button>
      </div>
    </div>
  );
};

export default Navbar;
