import React from 'react';
import AdminHeader from '../../components/AdminHeader';
import AdminFooter from '../../components/AdminFooter';
import './AdminSection.css';
const Products = () => (
  <div className="admin-section-bg">
    <AdminHeader />
    <div className="admin-section-container">
      <h2>Gestion des Produits</h2>
      <div className="admin-section-placeholder">Page de gestion des produits à venir...</div>
    </div>
    <AdminFooter />
  </div>
);
export default Products;
