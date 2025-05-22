import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          ProductApp
        </Link>
        
        <div className="navbar-menu">
          <Link to="/" className="navbar-item">
            Accueil
          </Link>
          <Link to="/products" className="navbar-item">
            Produits
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="navbar-item">
                Mon Tableau de Bord
              </Link>
              <div className="navbar-user">
                <span className="user-welcome">
                  Bonjour, {user?.username}
                </span>
                <button 
                  onClick={handleLogout}
                  className="btn btn-logout"
                >
                  Déconnexion
                </button>
              </div>
            </>
          ) : (
            <div className="navbar-auth">
              <Link to="/login" className="btn btn-login">
                Connexion
              </Link>
              <Link to="/register" className="btn btn-register">
                Inscription
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;