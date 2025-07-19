import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar';
import AdminHeader from '../../components/AdminHeader';
import AdminFooter from '../../components/AdminFooter';
import Dashboard from './Dashboard';
import Products from './Products';
import Contact from './Contact';
import Comments from './Comments';
import Statistics from './Statistics';
import Settings from './Settings';

const Admin = () => {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader />
        <main className="admin-content">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/comments" element={<Comments />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </main>
        <AdminFooter />
      </div>
    </div>
  );
};

export default Admin;