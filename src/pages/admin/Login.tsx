import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminHeader from '../../components/AdminHeader';
import AdminFooter from '../../components/AdminFooter';
import './AdminAuth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Créer un FormData
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);

      // Envoyer la requête POST vers le backend PHP via le proxy
      const response = await fetch('/admin/login.php', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      // Redirection vers le dashboard si succès
      if (response.ok) {
        window.location.href = '/admin/dashboard';
      } else {
        throw new Error('Erreur de connexion');
      }
    } catch (error) {
      setError('Une erreur est survenue lors de la connexion');
      console.error('Erreur de connexion:', error);
    } finally {
      setLoading(false);
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
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="admin-login-input"
            />
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="admin-login-input"
            />
            <button type="submit" disabled={loading} className="admin-login-button">
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
            {error && <div className="admin-login-error">{error}</div>}
          </form>
        </div>
      </div>
      <AdminFooter />
    </>
  );
};

export default Login;
