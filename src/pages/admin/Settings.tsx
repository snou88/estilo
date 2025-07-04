import React from 'react';
import AdminHeader from '../../components/AdminHeader';
import AdminFooter from '../../components/AdminFooter';
import './AdminSection.css';
const Settings = () => (
  <div className="admin-section-bg">
    <AdminHeader />
    <div className="admin-section-container">
      <h2>Paramètres</h2>
      <div className="admin-section-placeholder">Page de paramètres à venir...</div>
    </div>
    <AdminFooter />
  </div>
);
export default Settings;
