import React from 'react';

const AdminFooter = () => (
  <footer className="admin-footer">
    <div className="admin-footer-content">
      <span>© {new Date().getFullYear()} Estilo Admin</span>
      <span className="admin-footer-links">
        <a href="#" className="admin-footer-link">Mentions légales</a>
        <a href="#" className="admin-footer-link">Confidentialité</a>
      </span>
    </div>
  </footer>
);

export default AdminFooter;
