import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PaymentPage = () => {
  const [paymentData, setPaymentData] = useState({
    card_number: '',
    expiry_date: '',
    cvv: '',
    card_holder: ''
  });
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setPaymentData({
      ...paymentData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:8000/api/payment', 
        paymentData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      setPaymentSuccess(true);
    } catch (error) {
      console.error('Payment error:', error);
      alert('Ödeme işlemi başarısız! Lütfen bilgilerinizi kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  if (paymentSuccess) {
    return (
      <div className="payment-container">
        <div className="payment-success">
          <div className="success-icon">✓</div>
          <h2>Ödeme Başarılı!</h2>
          <p>Siparişiniz alınmıştır. Teşekkür ederiz!</p>
          <button 
            className="checkout-btn"
            onClick={() => navigate('/products')}
            style={{ marginTop: '2rem' }}
          >
            Alışverişe Devam Et
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-container">
      <h1>Ödeme İşlemi</h1>
      <div className="payment-form">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Kart Üzerindeki İsim</label>
            <input
              type="text"
              name="card_holder"
              value={paymentData.card_holder}
              onChange={handleChange}
              required
              placeholder="Ad Soyad"
            />
          </div>
          <div className="form-group">
            <label>Kart Numarası</label>
            <input
              type="text"
              name="card_number"
              value={paymentData.card_number}
              onChange={handleChange}
              required
              placeholder="0000 0000 0000 0000"
              maxLength="19"
            />
          </div>
          <div className="form-group">
            <label>Son Kullanma Tarihi</label>
            <input
              type="text"
              name="expiry_date"
              value={paymentData.expiry_date}
              onChange={handleChange}
              required
              placeholder="AA/YY"
              maxLength="5"
            />
          </div>
          <div className="form-group">
            <label>CVV</label>
            <input
              type="text"
              name="cvv"
              value={paymentData.cvv}
              onChange={handleChange}
              required
              placeholder="000"
              maxLength="3"
            />
          </div>
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Ödeme İşleniyor...' : 'Ödemeyi Tamamla'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentPage;
