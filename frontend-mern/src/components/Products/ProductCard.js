import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { formatPrice, truncateText } from '../../utils/helpers';

const ProductCard = ({ product, showActions = false, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const handleDelete = (e) => {
    e.stopPropagation(); // Empêcher la navigation lors du clic sur supprimer
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      onDelete(product._id);
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation(); // Empêcher la navigation lors du clic sur modifier
    onEdit(product);
  };

  const handleCardClick = () => {
    navigate(`/products/${product._id}`);
  };

  return (
    <div 
      onClick={handleCardClick}
      style={{ 
        border: '1px solid #ddd', 
        borderRadius: '8px',
        overflow: 'hidden',
        backgroundColor: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
      }}
    >
      
      <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
        {product.image ? (
          <img 
            src={product.image} 
            alt={product.name}
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover'
            }}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div 
          style={{ 
            display: product.image ? 'none' : 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            backgroundColor: '#f8f9fa',
            fontSize: '4rem'
          }}
        >
          📦
        </div>
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          backgroundColor: '#007bff',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: 'bold'
        }}>
          {product.category}
        </div>
      </div>

      <div style={{ padding: '15px' }}>
        <h3 style={{ 
          margin: '0 0 10px 0',
          fontSize: '1.2rem',
          color: '#333'
        }}>
          {product.name}
        </h3>
        
        {product.description && (
          <p style={{ 
            margin: '0 0 10px 0',
            color: '#666',
            fontSize: '14px',
            lineHeight: '1.4'
          }}>
            {truncateText(product.description, 80)}
          </p>
        )}

        <div style={{ 
          fontSize: '1.3rem',
          fontWeight: 'bold',
          color: '#28a745',
          margin: '10px 0'
        }}>
          {formatPrice(product.price)}
        </div>

        <div style={{ 
          fontSize: '12px',
          color: '#888',
          marginBottom: showActions ? '15px' : '0'
        }}>
          Par {product.owner?.username || 'Utilisateur inconnu'}
        </div>

        {showActions && (
          <div style={{ 
            display: 'flex', 
            gap: '10px',
            marginTop: '15px'
          }}>
            <button
              onClick={handleEdit}
              style={{ 
                flex: 1,
                padding: '8px 12px',
                backgroundColor: 'transparent',
                color: '#007bff',
                border: '1px solid #007bff',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#007bff';
                e.target.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#007bff';
              }}
            >
              Modifier
            </button>
            <button
              onClick={handleDelete}
              style={{ 
                flex: 1,
                padding: '8px 12px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#c82333'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#dc3545'}
            >
              Supprimer
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;