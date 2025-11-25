import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/cart', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setCartItems(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8000/api/cart/${itemId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setCartItems(cartItems.filter(item => item.id !== itemId));
      // Alert KALDIRILDI - sessizce kaldır
    } catch (error) {
      console.error('Error removing from cart:', error);
      alert('Ürün kaldırılırken hata oluştu!');
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) {
      // Eğer miktar 0 olursa ürünü kaldır
      await removeFromCart(itemId);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const item = cartItems.find(item => item.id === itemId);
      
      if (!item) return;

      // Önce mevcut ürünü kaldır
      await axios.delete(`http://localhost:8000/api/cart/${itemId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Sonra yeni miktarla yeniden ekle
      await axios.post('http://localhost:8000/api/cart', 
        { product_id: item.product_id, quantity: newQuantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Sepeti sessizce yenile (alert OLMADAN)
      fetchCartItems();
      
    } catch (error) {
      console.error('Error updating quantity:', error);
      alert('Miktar güncellenirken hata oluştu!');
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.total_price, 0).toFixed(2);
  };

  if (loading) {
    return (
      <div className="cart-container">
        <div style={{ textAlign: 'center', color: 'var(--silver)' }}>Sepet yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1>Alışveriş Sepetim</h1>
      
      {cartItems.length === 0 ? (
        <div style={{ textAlign: 'center', color: 'var(--silver)', marginTop: '2rem' }}>
          Sepetiniz boş
        </div>
      ) : (
        <>
          {cartItems.map(item => (
            <div key={item.id} className="cart-item">
              <img 
                src={item.product_image} 
                alt={item.product_name}
                className="cart-item-image"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500';
                }}
              />
              <div className="cart-item-details">
                <h3 className="cart-item-name">{item.product_name}</h3>
                <p className="cart-item-price">${item.product_price} x {item.quantity}</p>
                <p className="cart-item-price">Toplam: ${item.total_price.toFixed(2)}</p>
              </div>
              <div className="quantity-controls">
                <button 
                  className="quantity-btn"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                >
                  -
                </button>
                <span style={{ margin: '0 1rem', color: 'var(--silver)' }}>{item.quantity}</span>
                <button 
                  className="quantity-btn"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  +
                </button>
              </div>
              <button 
                className="remove-btn"
                onClick={async () => {
                  if (window.confirm('Bu ürünü sepetinizden kaldırmak istediğinize emin misiniz?')) {
                    await removeFromCart(item.id);
                    alert('Ürün sepetten kaldırıldı!');
                  }
                }}
              >
                Kaldır
              </button>
            </div>
          ))}
          
          <div className="cart-total">
            Toplam Tutar: <strong>${getTotalPrice()}</strong>
          </div>
          
          <button 
            className="checkout-btn"
            onClick={() => navigate('/payment')}
          >
            Ödemeye Geç
          </button>
        </>
      )}
    </div>
  );
};

export default CartPage;
