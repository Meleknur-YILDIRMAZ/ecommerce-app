import React from 'react';

const ProductCard = ({ product, onAddToCart }) => {
  return (
    <div className="product-card">
      <img 
        src={product.image_url} 
        alt={product.name}
        className="product-image"
        onError={(e) => {
          e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500';
        }}
      />
      <h3 className="product-name">{product.name}</h3>
      <p className="product-description">{product.description}</p>
      <div className="product-price">${product.price}</div>
      <button 
        className="add-to-cart-btn"
        onClick={() => onAddToCart(product.id)}
      >
        Sepete Ekle
      </button>
    </div>
  );
};

export default ProductCard;
