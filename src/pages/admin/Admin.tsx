import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Admin: React.FC = () => {
  const { isAuthenticated } = useAuth(); 

  if (!isAuthenticated) {
    return <Navigate to="/Admin/login" replace />;
  }

  return (
    <div className="admin-layout">
      <div className="admin-sidebar">
        <div className="admin-sidebar-logo">
          <img src="/logo.png" alt="Estilo" />
        </div>
        <nav className="admin-sidebar-nav">
          <a href="/admin/dashboard" className="admin-sidebar-link">
            <span className="admin-sidebar-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
              </svg>
            </span>
            <span>Dashboard</span>
          </a>
          <a href="/admin/products" className="admin-sidebar-link">
            <span className="admin-sidebar-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm10 0c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm-6-5c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm10 0c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
              </svg>
            </span>
            <span>Produits</span>
          </a>
          <a href="/admin/orders" className="admin-sidebar-link">
            <span className="admin-sidebar-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </span>
            <span>Commandes</span>
          </a>
          <a href="/admin/settings" className="admin-sidebar-link">
            <span className="admin-sidebar-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S15.33 8 14.5 8 13 8.67 13 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S8.33 8 7.5 8 6 8.67 6 9.5 6.67 11 7.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H5.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
              </svg>
            </span>
            <span>Paramètres</span>
          </a>
          <a href="/admin/statistics" className="admin-sidebar-link">
            <span className="admin-sidebar-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-2-8h-4v4h4v-4zm-6 0h-4v4h4v-4z"/>
              </svg>
            </span>
            <span>Statistiques</span>
          </a>
        </nav>
      </div>
      <div className="admin-main">
        <header className="admin-header">
          <div className="admin-header-title">
            <h1>Administration</h1>
          </div>
          <div className="admin-header-actions">
            <button onClick={() => window.location.href = '/'} className="admin-header-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
              </svg>
              <span>Retour au site</span>
            </button>
          </div>
        </header>
        <main>
        </main>
        <footer className="admin-footer">
          <p>&copy; 2025 Estilo. Tous droits réservés.</p>
        </footer>
      </div>
    </div>
  );
};

export default Admin;
