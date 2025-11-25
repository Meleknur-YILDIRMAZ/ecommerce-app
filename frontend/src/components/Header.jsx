import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = ({ setToken }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/login');
  };

  return (
    <header className="header">
      <nav className="nav">
        <div className="logo">Gece Mavisi Alışveriş</div>
        <div className="nav-links">
          <Link to="/products" className="nav-link">Ürünler</Link>
          <Link to="/cart" className="nav-link">Sepetim</Link>
          <button onClick={handleLogout} className="logout-btn">Çıkış Yap</button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
