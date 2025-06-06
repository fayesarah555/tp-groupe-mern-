// Fonction pour vérifier si le token JWT est valide
export const isTokenValid = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp > currentTime;
  } catch (error) {
    return false;
  }
};

// Fonction pour récupérer les données du token
export const getTokenData = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      id: payload.id || payload.userId,
      username: payload.username,
      email: payload.email
    };
  } catch (error) {
    return null;
  }
};

// Fonction pour supprimer le token
export const removeToken = () => {
  localStorage.removeItem('token');
};

// Fonction pour formater le prix
export const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(price);
};

// Fonction pour formater la date
export const formatDate = (dateString) => {
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Date(dateString).toLocaleDateString('fr-FR', options);
};

// Fonction pour valider un email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Fonction pour valider un mot de passe
export const isValidPassword = (password) => {
  return password.length >= 6;
};

// Fonction pour tronquer le texte
export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Fonction pour débouncer les recherches
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Fonction pour obtenir l'URL complète d'une image
export const getImageUrl = (product) => {
  if (product?.imageUrl) {
    // Image uploadée sur le serveur
    return `http://localhost:5000${product.imageUrl}`;
  } else if (product?.image) {
    // URL externe (pour la compatibilité)
    return product.image;
  }
  return null;
};

// Fonction pour valider un fichier image
export const validateImageFile = (file) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Type de fichier non autorisé. Utilisez JPG, PNG, GIF ou WebP.' };
  }

  if (file.size > maxSize) {
    return { valid: false, error: 'La taille du fichier ne doit pas dépasser 5MB.' };
  }

  return { valid: true };
};

// Catégories de produits par défaut
export const PRODUCT_CATEGORIES = [
  'Électronique',
  'Vêtements',
  'Maison & Jardin',
  'Sports & Loisirs',
  'Livres',
  'Automobile',
  'Santé & Beauté',
  'Jouets',
  'Alimentation',
  'Autres'
];

// Fonction pour gérer les erreurs d'API
export const handleApiError = (error) => {
  if (error.response) {
    // Le serveur a répondu avec un code d'erreur
    return error.response.data.message || error.response.data.error || 'Une erreur est survenue';
  } else if (error.request) {
    // La requête a été faite mais pas de réponse
    return 'Impossible de contacter le serveur';
  } else {
    // Autre erreur
    return 'Une erreur inattendue est survenue';
  }
};