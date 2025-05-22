import React, { useState } from 'react';
import { PRODUCT_CATEGORIES } from '../../utils/helpers';

const SearchFilter = ({ onSearchChange, onFilterChange, filters, onClearFilters }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearchChange(value);
  };

  const handleFilterChange = (filterName, value) => {
    const newFilters = {
      ...filters,
      [filterName]: value
    };
    onFilterChange(newFilters);
  };

  const hasActiveFilters = searchTerm || filters.category || filters.minPrice || filters.maxPrice;

  return (
    <div style={{ 
      backgroundColor: '#f8f9fa',
      padding: '20px',
      borderRadius: '8px',
      margin: '20px 0'
    }}>
      {/* Section de recherche */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ position: 'relative', maxWidth: '400px' }}>
          <input
            type="text"
            placeholder="Rechercher des produits..."
            value={searchTerm}
            onChange={handleSearchChange}
            style={{
              width: '100%',
              padding: '12px 40px 12px 12px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '16px'
            }}
          />
          <span style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '18px',
            color: '#666'
          }}>
            🔍
          </span>
        </div>
      </div>

      {/* Section des filtres */}
      <div>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '15px'
        }}>
          <h3 style={{ margin: 0, color: '#333' }}>Filtres</h3>
          {hasActiveFilters && (
            <button 
              onClick={() => {
                setSearchTerm('');
                onClearFilters();
              }}
              style={{
                padding: '6px 12px',
                backgroundColor: 'transparent',
                color: '#007bff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                textDecoration: 'underline'
              }}
            >
              Effacer tout
            </button>
          )}
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '15px'
        }}>
          <div>
            <label 
              htmlFor="category-filter" 
              style={{ 
                display: 'block', 
                marginBottom: '5px', 
                fontWeight: 'bold',
                color: '#333'
              }}
            >
              Catégorie
            </label>
            <select
              id="category-filter"
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                backgroundColor: 'white'
              }}
            >
              <option value="">Toutes les catégories</option>
              {PRODUCT_CATEGORIES.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label 
              htmlFor="min-price" 
              style={{ 
                display: 'block', 
                marginBottom: '5px', 
                fontWeight: 'bold',
                color: '#333'
              }}
            >
              Prix minimum (€)
            </label>
            <input
              type="number"
              id="min-price"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              placeholder="0"
              min="0"
              step="0.01"
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            />
          </div>

          <div>
            <label 
              htmlFor="max-price" 
              style={{ 
                display: 'block', 
                marginBottom: '5px', 
                fontWeight: 'bold',
                color: '#333'
              }}
            >
              Prix maximum (€)
            </label>
            <input
              type="number"
              id="max-price"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              placeholder="1000"
              min="0"
              step="0.01"
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            />
          </div>
        </div>

        {/* Filtres actifs */}
        {hasActiveFilters && (
          <div style={{ marginTop: '20px' }}>
            <span style={{ 
              fontSize: '14px', 
              fontWeight: 'bold',
              color: '#666',
              marginRight: '10px'
            }}>
              Filtres actifs :
            </span>
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: '8px',
              marginTop: '8px'
            }}>
              {searchTerm && (
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  backgroundColor: '#007bff',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  gap: '5px'
                }}>
                  Recherche: "{searchTerm}"
                  <button 
                    onClick={() => {
                      setSearchTerm('');
                      onSearchChange('');
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.category && (
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  backgroundColor: '#28a745',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  gap: '5px'
                }}>
                  Catégorie: {filters.category}
                  <button 
                    onClick={() => handleFilterChange('category', '')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.minPrice && (
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  backgroundColor: '#ffc107',
                  color: 'black',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  gap: '5px'
                }}>
                  Min: {filters.minPrice}€
                  <button 
                    onClick={() => handleFilterChange('minPrice', '')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'black',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.maxPrice && (
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  backgroundColor: '#fd7e14',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  gap: '5px'
                }}>
                  Max: {filters.maxPrice}€
                  <button 
                    onClick={() => handleFilterChange('maxPrice', '')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchFilter;