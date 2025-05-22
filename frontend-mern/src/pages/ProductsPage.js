import React, { useState, useEffect } from 'react';
import { productService } from '../services/api';
import { handleApiError, debounce } from '../utils/helpers';
import SearchFilter from '../components/Products/SearchFilter';
import ProductGrid from '../components/Products/ProductGrid';
// import '../styles/ProductsPage.css';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getAllProducts();
      setProducts(response.data);
      setError('');
    } catch (error) {
      setError(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    // Filtrer par terme de recherche
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower)
      );
    }

    // Filtrer par catégorie
    if (filters.category) {
      filtered = filtered.filter(product => 
        product.category === filters.category
      );
    }

    // Filtrer par prix
    if (filters.minPrice) {
      filtered = filtered.filter(product => 
        product.price >= parseFloat(filters.minPrice)
      );
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(product => 
        product.price <= parseFloat(filters.maxPrice)
      );
    }

    setFilteredProducts(filtered);
  };

  const debouncedSearch = debounce((term) => {
    setSearchTerm(term);
  }, 300);

  const handleSearchChange = (term) => {
    debouncedSearch(term);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: ''
    });
  };

  if (loading) {
    return (
      <div className="products-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Chargement des produits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="products-page">
      <div className="products-header">
        <h1>Tous les Produits</h1>
        <p>Découvrez les produits partagés par notre communauté</p>
      </div>

      {error && (
        <div className="message error">
          {error}
        </div>
      )}

      <SearchFilter
        onSearchChange={handleSearchChange}
        onFilterChange={handleFilterChange}
        filters={filters}
        onClearFilters={clearFilters}
      />

      <div className="products-results">
        <div className="results-header">
          <span className="results-count">
            {filteredProducts.length} produit{filteredProducts.length !== 1 ? 's' : ''} trouvé{filteredProducts.length !== 1 ? 's' : ''}
            {(searchTerm || filters.category || filters.minPrice || filters.maxPrice) && (
              <button onClick={clearFilters} className="btn btn-link">
                Effacer les filtres
              </button>
            )}
          </span>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>Aucun produit trouvé</h3>
            <p>
              {searchTerm || filters.category || filters.minPrice || filters.maxPrice
                ? 'Essayez de modifier vos critères de recherche'
                : 'Aucun produit n\'a encore été ajouté'
              }
            </p>
            {(searchTerm || filters.category || filters.minPrice || filters.maxPrice) && (
              <button onClick={clearFilters} className="btn btn-secondary">
                Voir tous les produits
              </button>
            )}
          </div>
        ) : (
          <ProductGrid products={filteredProducts} />
        )}
      </div>
    </div>
  );
};

export default ProductsPage;