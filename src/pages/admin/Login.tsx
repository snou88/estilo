import React, { useState } from 'react';
import AdminHeader from '../../components/AdminHeader';
import AdminFooter from '../../components/AdminFooter';
import './AdminAuth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo: Simple validation (à remplacer par une vraie logique d'authentification)
    if (email === 'admin@estilo.com' && password === 'admin123') {
      window.location.href = '/admin/dashboard';
    } else {
      setError('Identifiants invalides');
    }
  };

  return (
    <>
      <div className="admin-login-bg">
        <AdminHeader />
        <div className="admin-login-container">
          <h2>Connexion Admin</h2>
          <form onSubmit={handleSubmit} className="admin-login-form">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button type="submit">Se connecter</button>
            {error && <div className="admin-login-error">{error}</div>}
          </form>
        </div>
      </div>
      <AdminFooter />
    </>
  );
};

export default Login;
