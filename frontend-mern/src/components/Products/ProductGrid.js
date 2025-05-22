import React from 'react';
import ProductCard from './ProductCard';

const ProductGrid = ({ products, showActions = false, onEdit, onDelete }) => {
  if (!products || products.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '60px 20px',
        color: '#666'
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📦</div>
        <p style={{ fontSize: '18px', margin: 0 }}>Aucun produit à afficher</p>
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
      gap: '20px',
      padding: '20px 0'
    }}>
      {products.map(product => (
        <ProductCard
          key={product._id}
          product={product}
          showActions={showActions}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default ProductGrid;