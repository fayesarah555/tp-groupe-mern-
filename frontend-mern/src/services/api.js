import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token à chaque requête
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs de réponse
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
  getProfile: () => api.get('/auth/profile'),
};

// Services de produits
export const productService = {
  // Récupérer tous les produits (publique)
  getAllProducts: (params = {}) => api.get('/products', { params }),
  
  // Récupérer les produits de l'utilisateur connecté
  getUserProducts: () => api.get('/products/my-products'),
  
  // Récupérer un produit par ID
  getProductById: (id) => api.get(`/products/${id}`),
  
  // Créer un nouveau produit
  createProduct: (productData) => api.post('/products', productData),
  
  // Mettre à jour un produit
  updateProduct: (id, productData) => api.put(`/products/${id}`, productData),
  
  // Supprimer un produit
  deleteProduct: (id) => api.delete(`/products/${id}`),
  
  // Rechercher des produits
  searchProducts: (query, filters = {}) => {
    const params = { search: query, ...filters };
    return api.get('/products/search', { params });
  },
};

export default api;