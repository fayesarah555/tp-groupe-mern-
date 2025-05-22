import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const HomePage = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Section Hero */}
      <div style={{ 
        textAlign: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '60px 40px',
        borderRadius: '12px',
        marginBottom: '60px'
      }}>
        <h1 style={{ 
          fontSize: '3rem', 
          margin: '0 0 20px 0',
          fontWeight: 'bold'
        }}>
          Bienvenue sur ProductApp
        </h1>
        <p style={{ 
          fontSize: '1.3rem', 
          margin: '0 0 40px 0',
          opacity: 0.9
        }}>
          La plateforme collaborative pour gérer et découvrir des produits incroyables
        </p>
        
        {isAuthenticated ? (
          <div>
            <h3 style={{ fontSize: '1.8rem', margin: '0 0 10px 0' }}>
              Bonjour {user?.username} !
            </h3>
            <p style={{ fontSize: '1.1rem', margin: '0 0 30px 0', opacity: 0.9 }}>
              Prêt à gérer vos produits ?
            </p>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link 
                to="/dashboard" 
                style={{ 
                  display: 'inline-block',
                  padding: '12px 24px',
                  backgroundColor: '#fff',
                  color: '#667eea',
                  textDecoration: 'none',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                  transition: 'transform 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
              >
                Mon Tableau de Bord
              </Link>
              <Link 
                to="/products" 
                style={{ 
                  display: 'inline-block',
                  padding: '12px 24px',
                  backgroundColor: 'transparent',
                  color: '#fff',
                  textDecoration: 'none',
                  border: '2px solid white',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#fff';
                  e.target.style.color = '#667eea';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#fff';
                }}
              >
                Découvrir les produits
              </Link>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link 
              to="/register" 
              style={{ 
                display: 'inline-block',
                padding: '12px 24px',
                backgroundColor: '#fff',
                color: '#667eea',
                textDecoration: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              Commencer maintenant
            </Link>
            <Link 
              to="/products" 
              style={{ 
                display: 'inline-block',
                padding: '12px 24px',
                backgroundColor: 'transparent',
                color: '#fff',
                textDecoration: 'none',
                border: '2px solid white',
                borderRadius: '6px',
                fontWeight: 'bold',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#fff';
                e.target.style.color = '#667eea';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#fff';
              }}
            >
              Voir tous les produits
            </Link>
          </div>
        )}
      </div>

      {/* Section des fonctionnalités */}
      <div style={{ marginBottom: '60px' }}>
        <h2 style={{ 
          textAlign: 'center',
          fontSize: '2.5rem',
          margin: '0 0 40px 0',
          color: '#333'
        }}>
          Fonctionnalités principales
        </h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '30px'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '12px',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            transition: 'transform 0.3s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🛍️</div>
            <h3 style={{ fontSize: '1.5rem', margin: '0 0 15px 0', color: '#333' }}>
              Gestion de produits
            </h3>
            <p style={{ color: '#666', lineHeight: '1.6' }}>
              Créez, modifiez et supprimez vos produits en toute simplicité
            </p>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '12px',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            transition: 'transform 0.3s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🔍</div>
            <h3 style={{ fontSize: '1.5rem', margin: '0 0 15px 0', color: '#333' }}>
              Recherche avancée
            </h3>
            <p style={{ color: '#666', lineHeight: '1.6' }}>
              Trouvez rapidement les produits qui vous intéressent avec nos filtres
            </p>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '12px',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            transition: 'transform 0.3s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>👥</div>
            <h3 style={{ fontSize: '1.5rem', margin: '0 0 15px 0', color: '#333' }}>
              Plateforme collaborative
            </h3>
            <p style={{ color: '#666', lineHeight: '1.6' }}>
              Partagez vos produits avec la communauté et découvrez ceux des autres
            </p>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '12px',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            transition: 'transform 0.3s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🔐</div>
            <h3 style={{ fontSize: '1.5rem', margin: '0 0 15px 0', color: '#333' }}>
              Sécurité garantie
            </h3>
            <p style={{ color: '#666', lineHeight: '1.6' }}>
              Vos données sont protégées avec une authentification sécurisée
            </p>
          </div>
        </div>
      </div>

      {/* Section CTA */}
      <div style={{ 
        background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
        color: 'white',
        padding: '60px 40px',
        borderRadius: '12px',
        textAlign: 'center'
      }}>
        <h2 style={{ fontSize: '2.5rem', margin: '0 0 15px 0' }}>
          Prêt à commencer ?
        </h2>
        <p style={{ fontSize: '1.2rem', margin: '0 0 30px 0', opacity: 0.9 }}>
          Rejoignez notre communauté et commencez à gérer vos produits dès aujourd'hui
        </p>
        {!isAuthenticated && (
          <Link 
            to="/register" 
            style={{ 
              display: 'inline-block',
              padding: '16px 32px',
              backgroundColor: '#3498db',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#2980b9';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#3498db';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            Créer un compte gratuit
          </Link>
        )}
      </div>
    </div>
  );
};

export default HomePage;