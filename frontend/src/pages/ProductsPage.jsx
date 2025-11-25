import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'all', name: 'Tüm Ürünler' },
    { id: 'electronics', name: 'Elektronik' },
    { id: 'clothing', name: 'Giyim' },
    { id: 'books', name: 'Kitaplar' }
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(product => product.category === selectedCategory));
    }
  }, [selectedCategory, products]);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/products', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const addToCart = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8000/api/cart', 
        { product_id: productId, quantity: 1 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      alert('Ürün sepete eklendi!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Sepete eklenirken hata oluştu!');
    }
  };

  if (loading) {
    return (
      <div className="products-container">
        <div style={{ textAlign: 'center', color: 'var(--silver)', fontSize: '1.2rem' }}>
          Ürünler yükleniyor...
        </div>
      </div>
    );
  }

  return (
    <div className="products-container">
      <div className="products-header">
        <h1>Premium Ürün Koleksiyonu</h1>
        <p>Gece mavisi temalı eşsiz alışveriş deneyimi</p>
      </div>

      <div className="categories">
        {categories.map(category => (
          <button
            key={category.id}
            className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="products-grid">
        {filteredProducts.map(product => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onAddToCart={addToCart}
          />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div style={{ textAlign: 'center', color: 'var(--silver)', marginTop: '2rem' }}>
          Bu kategoride ürün bulunamadı.
        </div>
      )}
    </div>
  );
};

export default ProductsPage;

