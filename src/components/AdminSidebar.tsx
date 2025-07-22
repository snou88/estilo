import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, Mail, MessageCircle, BarChart2, Settings } from 'lucide-react';
import './AdminSidebar.css';

const links = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={22} /> },
  { to: '/admin/products', label: 'Produits', icon: <Package size={22} /> },
  { to: '/admin/contact', label: 'Contact', icon: <Mail size={22} /> },
  { to: '/admin/Orders', label: 'Order', icon: <MessageCircle size={22} /> },
  { to: '/admin/statistics', label: 'Statistiques', icon: <BarChart2 size={22} /> },
  { to: '/admin/settings', label: 'Paramètres', icon: <Settings size={22} /> },
];

const AdminSidebar = () => (
  <aside className="admin-sidebar">
    <div className="admin-sidebar-logo">
      <img src="/estilo.svg" alt="Estilo Admin" />
    </div>
    <nav className="admin-sidebar-nav">
      {links.map(link => (
        <NavLink
          to={link.to}
          className={({ isActive }) =>
            'admin-sidebar-link' + (isActive ? ' active' : '')
          }
          key={link.to}
        >
          <span className="admin-sidebar-icon">{link.icon}</span>
          <span>{link.label}</span>
        </NavLink>
      ))}
    </nav>
  </aside>
);

export default AdminSidebar;
