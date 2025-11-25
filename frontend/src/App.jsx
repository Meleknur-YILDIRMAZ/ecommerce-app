import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ProductsPage from './pages/ProductsPage';
import CartPage from './pages/CartPage';
import PaymentPage from './pages/PaymentPage';
import Header from './components/Header';

function App() {
  const [token, setToken] = React.useState(localStorage.getItem('token'));

  return (
    <Router>
      <div className="app">
        {token && <Header setToken={setToken} />}
        <Routes>
          <Route 
            path="/login" 
            element={!token ? <LoginPage setToken={setToken} /> : <Navigate to="/products" />} 
          />
          <Route 
            path="/products" 
            element={token ? <ProductsPage /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/cart" 
            element={token ? <CartPage /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/payment" 
            element={token ? <PaymentPage /> : <Navigate to="/login" />} 
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
