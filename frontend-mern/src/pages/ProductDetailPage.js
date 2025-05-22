import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { productService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { handleApiError, formatPrice, formatDate } from '../utils/helpers';
// import '../styles/ProductDetail.css';

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
      <div className="product-detail-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Chargement du produit...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail-page">
        <div className="error-container">
          <h2>Produit non trouvé</h2>
          <p>{error || 'Ce produit n\'existe pas ou a été supprimé.'}</p>
          <Link to="/products" className="btn btn-primary">
            Retour aux produits
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">
        <div className="breadcrumb">
          <Link to="/products">Produits</Link>
          <span> / </span>
          <span>{product.name}</span>
        </div>

        <div className="product-detail-card">
          <div className="product-image">
            {product.image ? (
              <img src={product.image} alt={product.name} />
            ) : (
              <div className="product-placeholder">
                <span>📦</span>
              </div>
            )}
          </div>

          <div className="product-info">
            <div className="product-header">
              <h1 className="product-title">{product.name}</h1>
              <div className="product-meta">
                <span className="product-category">{product.category}</span>
                <span className="product-date">
                  Ajouté le {formatDate(product.createdAt)}
                </span>
              </div>
            </div>

            <div className="product-price">
              {formatPrice(product.price)}
            </div>

            <div className="product-description">
              <h3>Description</h3>
              <p>{product.description || 'Aucune description disponible.'}</p>
            </div>

            <div className="product-owner">
              <h3>Propriétaire</h3>
              <div className="owner-info">
                <span className="owner-name">
                  {product.owner?.username || 'Utilisateur inconnu'}
                </span>
                <span className="owner-email">
                  {product.owner?.email}
                </span>
              </div>
            </div>

            {isOwner && (
              <div className="product-actions">
                <h3>Actions</h3>
                <div className="actions-buttons">
                  <Link 
                    to="/dashboard" 
                    state={{ editProduct: product }}
                    className="btn btn-primary"
                  >
                    Modifier
                  </Link>
                  <button
                    onClick={handleDelete}
                    className="btn btn-danger"
                    disabled={deleting}
                  >
                    {deleting ? 'Suppression...' : 'Supprimer'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="product-navigation">
          <Link to="/products" className="btn btn-secondary">
            ← Retour aux produits
          </Link>
          {isOwner && (
            <Link to="/dashboard" className="btn btn-outline">
              Mon tableau de bord
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;