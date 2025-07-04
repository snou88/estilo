import React from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import AdminHeader from '../../components/AdminHeader';
import AdminFooter from '../../components/AdminFooter';
import './AdminSection.css';

const Orders = () => {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader />
        <main className="admin-content">
          <h2 className="admin-dashboard-title">Gestion des commandes</h2>
          <p>Page de gestion des commandes (à compléter).</p>
        </main>
        <AdminFooter />
      </div>
    </div>
  );
};

export default Orders;
