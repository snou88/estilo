import React from 'react';
import { LogOut } from 'lucide-react';
import './AdminHeader.css';

const ADMIN_NAME = 'Estilo Admin'; // Change ici si besoin

const AdminHeader = () => {
  const handleLogout = () => {
    window.location.href = '/admin/login';
  };
  return (
    <header className="admin-header-bar">
      <div className="admin-header-bar-inner">
        <div className="admin-header-logo">
          <img src="/estilo.svg" alt="Estilo Admin" />
        </div>
        <div className="admin-header-user">
          <span className="admin-header-username">{ADMIN_NAME}</span>
          <button className="admin-header-logout-btn" onClick={handleLogout} title="Déconnexion">
            <LogOut size={21} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
