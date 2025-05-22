import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={{ 
      backgroundColor: '#333', 
      padding: '1rem', 
      display: 'flex', 
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem' }}>
        ProductApp
      </Link>
      
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
          Accueil
        </Link>
        <Link to="/products" style={{ color: 'white', textDecoration: 'none' }}>
          Produits
        </Link>
        
        {isAuthenticated ? (
          <>
            <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>
              Tableau de Bord
            </Link>
            <span style={{ color: 'white' }}>
              Bonjour, {user?.username}
            </span>
            <button 
              onClick={handleLogout}
              style={{ 
                backgroundColor: '#e74c3c', 
                color: 'white', 
                border: 'none', 
                padding: '0.5rem 1rem',
                cursor: 'pointer'
              }}
            >
              Déconnexion
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>
              Connexion
            </Link>
            <Link to="/register" style={{ color: 'white', textDecoration: 'none' }}>
              Inscription
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;