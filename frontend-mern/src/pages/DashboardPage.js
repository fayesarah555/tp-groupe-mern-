import React, { useState, useEffect } from 'react';
import { useAuth } from '../contextes/AuthContext';
import { productService } from '../services/api';
import { handleApiError } from '../utils/helpers';
import ProductForm from '../components/Products/ProductForm';
import UserProductList from '../components/Products/UserProductList';
import UploadTest from '../components/Products/UploadTest';

const DashboardPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [message, setMessage] = useState('');
  const [showUploadTest, setShowUploadTest] = useState(false);

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
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div>Chargement de vos produits...</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ margin: '0 0 10px 0', color: '#333' }}>Mon Tableau de Bord</h1>
        <p style={{ color: '#666', margin: '0' }}>Bienvenue, {user?.username} !</p>
      </div>

      {message && (
        <div style={{ 
          backgroundColor: '#d4edda', 
          color: '#155724', 
          padding: '10px', 
          borderRadius: '4px',
          marginBottom: '20px',
          border: '1px solid #c3e6cb'
        }}>
          {message}
        </div>
      )}

      {error && (
        <div style={{ 
          backgroundColor: '#f8d7da', 
          color: '#721c24', 
          padding: '10px', 
          borderRadius: '4px',
          marginBottom: '20px',
          border: '1px solid #f5c6cb'
        }}>
          {error}
        </div>
      )}

      <div style={{ marginBottom: '30px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button 
          onClick={() => setShowForm(true)}
          style={{ 
            padding: '12px 24px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
          disabled={showForm}
        >
          {showForm ? 'Formulaire ouvert' : 'Ajouter un produit'}
        </button>

        {/* <button 
          onClick={() => setShowUploadTest(!showUploadTest)}
          style={{ 
            padding: '12px 24px',
            backgroundColor: showUploadTest ? '#dc3545' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          {showUploadTest ? 'Masquer le test' : 'Tester l\'upload'}
        </button> */}
      </div>

      {showUploadTest && (
        <UploadTest />
      )}

      {showForm && (
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ margin: '0 0 20px 0', color: '#333' }}>
            {editingProduct ? 'Modifier le produit' : 'Ajouter un nouveau produit'}
          </h2>
          <ProductForm
            product={editingProduct}
            onProductCreated={handleProductCreated}
            onProductUpdated={handleProductUpdated}
            onCancel={handleCancelForm}
          />
        </div>
      )}

      <div>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h2 style={{ margin: 0, color: '#333' }}>Mes Produits</h2>
          <span style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '4px 12px', 
            borderRadius: '20px',
            fontSize: '14px',
            color: '#666'
          }}>
            {products.length} produit{products.length !== 1 ? 's' : ''}
          </span>
        </div>

        {products.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            border: '2px dashed #dee2e6'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📦</div>
            <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>Aucun produit pour le moment</h3>
            <p style={{ color: '#666', margin: '0 0 20px 0' }}>Commencez par ajouter votre premier produit !</p>
            <button 
              onClick={() => setShowForm(true)}
              style={{ 
                padding: '12px 24px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
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