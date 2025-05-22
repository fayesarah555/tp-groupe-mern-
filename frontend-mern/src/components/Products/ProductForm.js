import React, { useState, useEffect } from 'react';
import { productService } from '../../services/api';
import { handleApiError, PRODUCT_CATEGORIES } from '../../utils/helpers';

const ProductForm = ({ product, onProductCreated, onProductUpdated, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const isEditing = !!product;

  useEffect(() => {
    if (isEditing && product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        category: product.category || '',
        image: product.image || ''
      });
    }
  }, [product, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Effacer l'erreur pour ce champ
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom du produit est requis';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Le nom doit contenir au moins 2 caractères';
    }

    if (!formData.price) {
      newErrors.price = 'Le prix est requis';
    } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Le prix doit être un nombre positif';
    }

    if (!formData.category) {
      newErrors.category = 'La catégorie est requise';
    }

    if (formData.image && !isValidUrl(formData.image)) {
      newErrors.image = 'L\'URL de l\'image n\'est pas valide';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        category: formData.category,
        image: formData.image.trim() || undefined
      };

      if (isEditing) {
        const response = await productService.updateProduct(product._id, productData);
        onProductUpdated(response.data);
      } else {
        const response = await productService.createProduct(productData);
        onProductCreated(response.data);
      }

      // Réinitialiser le formulaire si c'est une création
      if (!isEditing) {
        setFormData({
          name: '',
          description: '',
          price: '',
          category: '',
          image: ''
        });
      }
      
    } catch (error) {
      const errorMessage = handleApiError(error);
      setErrors({ submit: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      border: '1px solid #ddd', 
      padding: '20px', 
      borderRadius: '8px',
      backgroundColor: '#f9f9f9',
      margin: '20px 0'
    }}>
      {errors.submit && (
        <div style={{ 
          color: 'red', 
          backgroundColor: '#ffe6e6', 
          padding: '10px', 
          borderRadius: '4px',
          marginBottom: '15px'
        }}>
          {errors.submit}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="name" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Nom du produit *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            style={{ 
              width: '100%', 
              padding: '8px', 
              border: errors.name ? '2px solid red' : '1px solid #ccc',
              borderRadius: '4px'
            }}
            placeholder="Nom de votre produit"
            disabled={loading}
          />
          {errors.name && <span style={{ color: 'red', fontSize: '14px' }}>{errors.name}</span>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="description" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            style={{ 
              width: '100%', 
              padding: '8px', 
              border: '1px solid #ccc',
              borderRadius: '4px',
              resize: 'vertical'
            }}
            placeholder="Décrivez votre produit..."
            disabled={loading}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
          <div>
            <label htmlFor="price" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Prix (€) *
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              style={{ 
                width: '100%', 
                padding: '8px', 
                border: errors.price ? '2px solid red' : '1px solid #ccc',
                borderRadius: '4px'
              }}
              placeholder="0.00"
              min="0"
              step="0.01"
              disabled={loading}
            />
            {errors.price && <span style={{ color: 'red', fontSize: '14px' }}>{errors.price}</span>}
          </div>

          <div>
            <label htmlFor="category" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Catégorie *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              style={{ 
                width: '100%', 
                padding: '8px', 
                border: errors.category ? '2px solid red' : '1px solid #ccc',
                borderRadius: '4px'
              }}
              disabled={loading}
            >
              <option value="">Sélectionner une catégorie</option>
              {PRODUCT_CATEGORIES.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && <span style={{ color: 'red', fontSize: '14px' }}>{errors.category}</span>}
          </div>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="image" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            URL de l'image (optionnel)
          </label>
          <input
            type="url"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleChange}
            style={{ 
              width: '100%', 
              padding: '8px', 
              border: errors.image ? '2px solid red' : '1px solid #ccc',
              borderRadius: '4px'
            }}
            placeholder="https://exemple.com/image.jpg"
            disabled={loading}
          />
          {errors.image && <span style={{ color: 'red', fontSize: '14px' }}>{errors.image}</span>}
          {formData.image && !errors.image && (
            <div style={{ marginTop: '10px' }}>
              <img 
                src={formData.image} 
                alt="Aperçu" 
                style={{ maxWidth: '200px', maxHeight: '150px', borderRadius: '4px' }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  setErrors(prev => ({ ...prev, image: 'Image non accessible' }));
                }} 
              />
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={onCancel}
            style={{ 
              padding: '10px 20px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
            disabled={loading}
          >
            Annuler
          </button>
          <button
            type="submit"
            style={{ 
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
            disabled={loading}
          >
            {loading 
              ? (isEditing ? 'Modification...' : 'Création...') 
              : (isEditing ? 'Modifier le produit' : 'Créer le produit')
            }
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;