import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Ajouter le token à chaque requête
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Si c'est un FormData, laisser axios gérer le Content-Type automatiquement
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  
  return config;
});

// Gérer les erreurs 401 (non autorisé)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Services d'authentification
export const authService = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
};

// Services de produits
export const productService = {
  getAllProducts: () => api.get('/products'),
  getUserProducts: () => api.get('/products/my-products'),
  getProductById: (id) => api.get(`/products/${id}`),
  
  // Méthodes qui supportent FormData et JSON
  createProduct: (productData) => {
    const config = {};
    if (productData instanceof FormData) {
      config.headers = { 'Content-Type': 'multipart/form-data' };
    }
    return api.post('/products', productData, config);
  },
  
  updateProduct: (id, productData) => {
    const config = {};
    if (productData instanceof FormData) {
      config.headers = { 'Content-Type': 'multipart/form-data' };
    }
    return api.put(`/products/${id}`, productData, config);
  },
  
  deleteProduct: (id) => api.delete(`/products/${id}`),
  
  // Service pour tester l'upload
  testUpload: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/products/upload-test', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
};

export default api;