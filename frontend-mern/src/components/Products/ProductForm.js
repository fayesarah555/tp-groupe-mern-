import React, { useState, useEffect } from 'react';
import { productService } from '../../services/api';
import { handleApiError, PRODUCT_CATEGORIES } from '../../utils/helpers';

const ProductForm = ({ product, onProductCreated, onProductUpdated, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
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
      });
      
      // Afficher l'image existante
      if (product.imageUrl) {
        setImagePreview(`http://localhost:5000${product.imageUrl}`);
      }
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validation du fichier
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          image: 'Type de fichier non autorisé. Utilisez JPG, PNG, GIF ou WebP.'
        }));
        return;
      }

      if (file.size > maxSize) {
        setErrors(prev => ({
          ...prev,
          image: 'La taille du fichier ne doit pas dépasser 5MB.'
        }));
        return;
      }

      setSelectedImage(file);
      
      // Créer une prévisualisation
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);

      // Effacer l'erreur image
      if (errors.image) {
        setErrors(prev => ({
          ...prev,
          image: ''
        }));
      }
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      // Créer un FormData pour gérer le fichier
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name.trim());
      formDataToSend.append('description', formData.description.trim());
      formDataToSend.append('price', parseFloat(formData.price));
      formDataToSend.append('category', formData.category);
      
      // Ajouter l'image si une nouvelle a été sélectionnée
      if (selectedImage) {
        formDataToSend.append('image', selectedImage);
      }

      if (isEditing) {
        const response = await productService.updateProduct(product._id, formDataToSend);
        onProductUpdated(response.data);
      } else {
        const response = await productService.createProduct(formDataToSend);
        onProductCreated(response.data);
      }

      // Réinitialiser le formulaire si c'est une création
      if (!isEditing) {
        setFormData({
          name: '',
          description: '',
          price: '',
          category: '',
        });
        setSelectedImage(null);
        setImagePreview('');
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
            Image du produit (optionnel)
          </label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            style={{ 
              width: '100%', 
              padding: '8px', 
              border: errors.image ? '2px solid red' : '1px solid #ccc',
              borderRadius: '4px'
            }}
            disabled={loading}
          />
          {errors.image && <span style={{ color: 'red', fontSize: '14px' }}>{errors.image}</span>}
          
          {imagePreview && (
            <div style={{ marginTop: '10px' }}>
              <p style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>Aperçu :</p>
              <img 
                src={imagePreview} 
                alt="Aperçu" 
                style={{ 
                  maxWidth: '200px', 
                  maxHeight: '150px', 
                  borderRadius: '4px',
                  border: '1px solid #ddd'
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