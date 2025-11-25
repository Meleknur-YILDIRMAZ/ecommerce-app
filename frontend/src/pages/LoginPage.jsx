import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = ({ setToken }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // Login işlemi
        const loginData = new URLSearchParams();
        loginData.append('username', formData.email);
        loginData.append('password', formData.password);
        
        const response = await axios.post('http://localhost:8000/token', loginData, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });
        
        const { access_token } = response.data;
        localStorage.setItem('token', access_token);
        setToken(access_token);
        navigate('/products');
      } else {
        // Register işlemi
        await axios.post('http://localhost:8000/register', {
          email: formData.email,
          password: formData.password,
          full_name: formData.full_name
        });
        
        // Register sonrası otomatik login
        const loginData = new URLSearchParams();
        loginData.append('username', formData.email);
        loginData.append('password', formData.password);
        
        const loginResponse = await axios.post('http://localhost:8000/token', loginData, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });
        
        const { access_token } = loginResponse.data;
        localStorage.setItem('token', access_token);
        setToken(access_token);
        navigate('/products');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      alert(isLogin ? 'Giriş başarısız! Email veya şifre hatalı.' : 'Kayıt başarısız! Bu email zaten kullanılıyor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>{isLogin ? 'Giriş Yap' : 'Kayıt Ol'}</h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label>Tam Adı</label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
                placeholder="Adınız ve soyadınız"
              />
            </div>
          )}
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="ornek@email.com"
            />
          </div>
          <div className="form-group">
            <label>Şifre</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="En az 6 karakter"
              minLength="6"
            />
          </div>
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'İşleniyor...' : (isLogin ? 'Giriş Yap' : 'Kayıt Ol')}
          </button>
        </form>
        <div className="auth-links">
          <a 
            href="#" 
            className="auth-link" 
            onClick={(e) => {
              e.preventDefault();
              setIsLogin(!isLogin);
              setFormData({ email: '', password: '', full_name: '' });
            }}
          >
            {isLogin ? 'Hesabın yok mu? Kayıt Ol' : 'Zaten hesabın var mı? Giriş Yap'}
          </a>
          {isLogin && (
            <a href="#" className="auth-link" onClick={(e) => {
              e.preventDefault();
              alert('Şifre sıfırlama bağlantısı emailinize gönderildi! (Demo)');
            }}>
              Şifremi Unuttum
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
