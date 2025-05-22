import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { productService } from '../services/api';
import { useAuth } from '../contextes/AuthContext';
import { handleApiError, formatPrice, formatDate } from '../utils/helpers';

const ProductDetailPage = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productService.getProductById(id);
      setProduct(response.data);
      setError('');
    } catch (error) {
      setError(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      return;
    }

    try {
      setDeleting(true);
      await productService.deleteProduct(id);
      navigate('/dashboard', { 
        state: { message: 'Produit supprimé avec succès' }
      });
    } catch (error) {
      setError(handleApiError(error));
      setDeleting(false);
    }
  };

  const isOwner = isAuthenticated && user && product && 
    (user.id === product.owner._id || user.id === product.owner);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div>Chargement du produit...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2>Produit non trouvé</h2>
        <p>{error || 'Ce produit n\'existe pas ou a été supprimé.'}</p>
        <Link 
          to="/products" 
          style={{ 
            display: 'inline-block',
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px'
          }}
        >
          Retour aux produits
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      {/* Breadcrumb */}
      <div style={{ marginBottom: '20px', fontSize: '14px', color: '#666' }}>
        <Link to="/products" style={{ color: '#007bff', textDecoration: 'none' }}>
          Produits
        </Link>
        <span> / </span>
        <span>{product.name}</span>
      </div>

      {/* Contenu principal */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '40px',
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        {/* Image du produit */}
        <div>
          {product.image ? (
            <img 
              src={product.image} 
              alt={product.name}
              style={{ 
                width: '100%', 
                height: '400px', 
                objectFit: 'cover',
                borderRadius: '8px'
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
              height: '400px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              fontSize: '6rem'
            }}
          >
            📦
          </div>
        </div>

        {/* Informations du produit */}
        <div>
          <div style={{ marginBottom: '20px' }}>
            <h1 style={{ margin: '0 0 10px 0', color: '#333', fontSize: '2rem' }}>
              {product.name}
            </h1>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <span style={{
                backgroundColor: '#007bff',
                color: 'white',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '14px'
              }}>
                {product.category}
              </span>
              <span style={{ color: '#666', fontSize: '14px' }}>
                Ajouté le {formatDate(product.createdAt)}
              </span>
            </div>
          </div>

          <div style={{ 
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#28a745',
            marginBottom: '20px'
          }}>
            {formatPrice(product.price)}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>Description</h3>
            <p style={{ color: '#666', lineHeight: '1.6' }}>
              {product.description || 'Aucune description disponible.'}
            </p>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>Propriétaire</h3>
            <div>
              <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                {product.owner?.username || 'Utilisateur inconnu'}
              </div>
              <div style={{ color: '#666', fontSize: '14px' }}>
                {product.owner?.email}
              </div>
            </div>
          </div>

          {isOwner && (
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ margin: '0 0 15px 0', color: '#333' }}>Actions</h3>
              <div style={{ display: 'flex', gap: '10px' }}>
                <Link 
                  to="/dashboard" 
                  state={{ editProduct: product }}
                  style={{
                    display: 'inline-block',
                    padding: '10px 20px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '4px',
                    fontWeight: 'bold'
                  }}
                >
                  Modifier
                </Link>
                <button
                  onClick={handleDelete}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                  disabled={deleting}
                >
                  {deleting ? 'Suppression...' : 'Supprimer'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '30px'
      }}>
        <Link 
          to="/products" 
          style={{
            display: 'inline-block',
            padding: '10px 20px',
            backgroundColor: '#6c757d',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px'
          }}
        >
          ← Retour aux produits
        </Link>
        {isOwner && (
          <Link 
            to="/dashboard" 
            style={{
              display: 'inline-block',
              padding: '10px 20px',
              backgroundColor: 'transparent',
              color: '#007bff',
              textDecoration: 'none',
              border: '1px solid #007bff',
              borderRadius: '4px'
            }}
          >
            Mon tableau de bord
          </Link>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;