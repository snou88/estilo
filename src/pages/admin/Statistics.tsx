import React from 'react';
import AdminHeader from '../../components/AdminHeader';
import AdminFooter from '../../components/AdminFooter';
import './AdminSection.css';
const Statistics = () => (
  <div className="admin-section-bg">
    <AdminHeader />
    <div className="admin-section-container">
      <h2>Statistiques</h2>
      <div className="admin-section-placeholder">Page de statistiques à venir...</div>
    </div>
    <AdminFooter />
  </div>
);
export default Statistics;
