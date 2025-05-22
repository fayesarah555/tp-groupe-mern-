import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { productService } from '../services/api';

const DashboardPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Formulaire
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: ''
  });

  const { user } = useAuth();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productService.getUserProducts();
      setProducts(response.data);
    } catch (error) {
      setError('Erreur lors du chargement des produits');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await productService.updateProduct(editingProduct._id, formData);
      } else {
        await productService.createProduct(formData);
      }
      
      setFormData({ name: '', description: '', price: '', category: '' });
      setShowForm(false);
      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      setError('Erreur lors de la sauvegarde');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      category: product.category
    });
    setShowForm(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Supprimer ce produit ?')) {
      try {
        await productService.deleteProduct(productId);
        fetchProducts();
      } catch (error) {
        setError('Erreur lors de la suppression');
      }
    }
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <div>
      <h1>Mon Tableau de Bord</h1>
      <p>Bienvenue, {user?.username} !</p>

      {error && <div style={{ color: 'red' }}>{error}</div>}

      <button 
        onClick={() => setShowForm(!showForm)}
        style={{ 
          padding: '0.5rem 1rem', 
          backgroundColor: '#3498db', 
          color: 'white', 
          border: 'none',
          marginBottom: '1rem'
        }}
      >
        {showForm ? 'Fermer' : 'Ajouter un produit'}
      </button>

      {showForm && (
        <div style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '2rem' }}>
          <h3>{editingProduct ? 'Modifier' : 'Ajouter'} un produit</h3>
          <form onSubmit={handleFormSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <input
                type="text"
                placeholder="Nom du produit"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
                style={{ width: '100%', padding: '0.5rem' }}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                style={{ width: '100%', padding: '0.5rem', height: '100px' }}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <input
                type="number"
                placeholder="Prix"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                required
                step="0.01"
                style={{ width: '100%', padding: '0.5rem' }}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                required
                style={{ width: '100%', padding: '0.5rem' }}
              >
                <option value="">Choisir une catégorie</option>
                <option value="Électronique">Électronique</option>
                <option value="Vêtements">Vêtements</option>
                <option value="Maison">Maison</option>
                <option value="Sport">Sport</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
            <div>
              <button type="submit" style={{ padding: '0.5rem 1rem', backgroundColor: '#2ecc71', color: 'white', border: 'none' }}>
                {editingProduct ? 'Modifier' : 'Ajouter'}
              </button>
              <button 
                type="button" 
                onClick={() => {
                  setShowForm(false);
                  setEditingProduct(null);
                  setFormData({ name: '', description: '', price: '', category: '' });
                }}
                style={{ padding: '0.5rem 1rem', backgroundColor: '#95a5a6', color: 'white', border: 'none', marginLeft: '0.5rem' }}
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      <h2>Mes Produits ({products.length})</h2>
      
      {products.length === 0 ? (
        <p>Vous n'avez encore aucun produit. Commencez par en ajouter un !</p>
      ) : (
        <div>
          {products.map(product => (
            <div key={product._id} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
              <h3>{product.name}</h3>
              <p><strong>Prix:</strong> {product.price}€</p>
              <p><strong>Catégorie:</strong> {product.category}</p>
              {product.description && <p><strong>Description:</strong> {product.description}</p>}
              <div>
                <button 
                  onClick={() => handleEdit(product)}
                  style={{ padding: '0.25rem 0.5rem', backgroundColor: '#f39c12', color: 'white', border: 'none', marginRight: '0.5rem' }}
                >
                  Modifier
                </button>
                <button 
                  onClick={() => handleDelete(product._id)}
                  style={{ padding: '0.25rem 0.5rem', backgroundColor: '#e74c3c', color: 'white', border: 'none' }}
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;