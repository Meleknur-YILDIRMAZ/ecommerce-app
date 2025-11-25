import React, { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import ProductList from './components/Product/ProductList';
import Cart from './components/Cart/Cart';
import Header from './components/Common/Header';
import './styles/auth.css';
import './styles/main.css';

function App() {
  const [currentView, setCurrentView] = useState('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [registeredUsers, setRegisteredUsers] = useState([
    { email: "melek@test.com", password: "melek123", username: "melek" },
    { email: "test@test.com", password: "test123", username: "testkullanici" },
    { email: "admin@test.com", password: "admin123", username: "admin" }
  ]);

  // Sepet işlemleri
  const addToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  // Auth işlemleri - GERÇEK AUTHENTICATION
  const handleLogin = (credentials) => {
    // Validation
    if (!credentials.email || !credentials.password) {
      alert('❌ Lütfen email ve şifre girin!');
      return;
    }

    // Email format kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(credentials.email)) {
      alert('❌ Lütfen geçerli bir email adresi girin!');
      return;
    }

    // Kullanıcıyı bul
    const user = registeredUsers.find(u => 
      u.email === credentials.email && u.password === credentials.password
    );

    if (!user) {
      alert('❌ Geçersiz email veya şifre!');
      return;
    }

    // Başarılı giriş
    setIsLoggedIn(true);
    setCurrentUser({
      email: user.email,
      username: user.username
    });
    setCurrentView('products');
    alert(`✅ Hoş geldiniz, ${user.username}!`);
  };

  const handleRegister = (userData) => {
    // Validation
    if (!userData.email || !userData.password || !userData.username) {
      alert('❌ Lütfen tüm alanları doldurun!');
      return;
    }

    if (userData.password !== userData.confirmPassword) {
      alert('❌ Şifreler eşleşmiyor!');
      return;
    }

    // Email format kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      alert('❌ Lütfen geçerli bir email adresi girin!');
      return;
    }

    // Kullanıcı adı kontrolü
    if (userData.username.length < 2) {
      alert('❌ Kullanıcı adı en az 2 karakter olmalıdır!');
      return;
    }

    // Şifre güçlülük kontrolü
    if (userData.password.length < 6) {
      alert('❌ Şifre en az 6 karakter olmalıdır!');
      return;
    }

    // Email zaten kayıtlı mı?
    const existingUser = registeredUsers.find(u => u.email === userData.email);
    if (existingUser) {
      alert('❌ Bu email adresi zaten kayıtlı!');
      return;
    }

    // ✅ YENİ KULLANICIYI KAYDET
    const newUser = {
      email: userData.email,
      password: userData.password,
      username: userData.username
    };

    setRegisteredUsers(prev => [...prev, newUser]);
    setIsLoggedIn(true);
    setCurrentUser({
      email: newUser.email,
      username: newUser.username
    });
    setCurrentView('products');
    alert(`✅ Kayıt başarılı! Hoş geldiniz, ${newUser.username}!`);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setCartItems([]);
    setCurrentView('login');
    alert('Çıkış yapıldı!');
  };

  // View render
  const renderView = () => {
    if (!isLoggedIn) {
      switch (currentView) {
        case 'register':
          return (
            <Register 
              onSwitchToLogin={() => setCurrentView('login')}
              onRegister={handleRegister}
            />
          );
        case 'forgotPassword':
          return (
            <ForgotPassword 
              onSwitchToLogin={() => setCurrentView('login')}
            />
          );
        default:
          return (
            <Login
              onSwitchToRegister={() => setCurrentView('register')}
              onSwitchToForgotPassword={() => setCurrentView('forgotPassword')}
              onLogin={handleLogin}
            />
          );
      }
    }

    return (
      <>
        <Header
          cartItemsCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
          onCartClick={() => setIsCartOpen(true)}
          onLogout={handleLogout}
          username={currentUser?.username}
        />
        <main className="main-content">
          <ProductList onAddToCart={addToCart} />
        </main>

        <Cart
          cartItems={cartItems}
          onUpdateQuantity={updateQuantity}
          onRemoveFromCart={removeFromCart}
          onClose={() => setIsCartOpen(false)}
          isOpen={isCartOpen}
        />
      </>
    );
  };

  return (
    <div className="app">
      {renderView()}
    </div>
  );
}

export default App;
