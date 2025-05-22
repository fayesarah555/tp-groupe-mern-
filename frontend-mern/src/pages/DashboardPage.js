import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { productService } from '../services/api';
import { handleApiError } from '../utils/helpers';
import ProductForm from '../components/Products/ProductForm';
import UserProductList from '../components/Products/UserProductList';
import '../styles/Dashboard.css';

const DashboardPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [message, setMessage] = useState('');

  const { user } = useAuth();

  useEffect(() => {
    fetchUserProducts();
  }, []);

  const fetchUserProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getUserProducts();
      setProducts(response.data);
      setError('');
    } catch (error) {
      setError(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const handleProductCreated = (newProduct) => {
    setProducts(prev => [newProduct, ...prev]);
    setShowForm(false);
    setMessage('Produit créé avec succès !');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleProductUpdated = (updatedProduct) => {
    setProducts(prev => 
      prev.map(product => 
        product._id === updatedProduct._id ? updatedProduct : product
      )
    );
    setEditingProduct(null);
    setShowForm(false);
    setMessage('Produit mis à jour avec succès !');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleProductDeleted = (productId) => {
    setProducts(prev => prev.filter(product => product._id !== productId));
    setMessage('Produit supprimé avec succès !');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Chargement de vos produits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Mon Tableau de Bord</h1>
        <p>Bienvenue, {user?.username} !</p>
      </div>

      {message && (
        <div className="message success">
          {message}
        </div>
      )}

      {error && (
        <div className="message error">
          {error}
        </div>
      )}

      <div className="dashboard-actions">
        <button 
          onClick={() => setShowForm(true)}
          className="btn btn-primary"
          disabled={showForm}
        >
          {showForm ? 'Formulaire ouvert' : 'Ajouter un produit'}
        </button>
      </div>

      {showForm && (
        <div className="form-section">
          <h2>{editingProduct ? 'Modifier le produit' : 'Ajouter un nouveau produit'}</h2>
          <ProductForm
            product={editingProduct}
            onProductCreated={handleProductCreated}
            onProductUpdated={handleProductUpdated}
            onCancel={handleCancelForm}
          />
        </div>
      )}

      <div className="products-section">
        <div className="section-header">
          <h2>Mes Produits</h2>
          <span className="products-count">
            {products.length} produit{products.length !== 1 ? 's' : ''}
          </span>
        </div>

        {products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h3>Aucun produit pour le moment</h3>
            <p>Commencez par ajouter votre premier produit !</p>
            <button 
              onClick={() => setShowForm(true)}
              className="btn btn-primary"
            >
              Ajouter mon premier produit
            </button>
          </div>
        ) : (
          <UserProductList
            products={products}
            onEdit={handleEdit}
            onDelete={handleProductDeleted}
          />
        )}
      </div>
    </div>
  );
};

export default DashboardPage;