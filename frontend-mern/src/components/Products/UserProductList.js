import React from 'react';
import ProductGrid from './ProductGrid';

const UserProductList = ({ products, onEdit, onDelete }) => {
  return (
    <div>
      <ProductGrid
        products={products}
        showActions={true}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
};

export default UserProductList;