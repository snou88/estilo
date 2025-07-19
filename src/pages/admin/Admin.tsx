import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import Products from './Products';
import Contact from './Contact';
import Orders from './Orders';
import Statistics from './Statistics';
import Settings from './Settings';
import './AdminLayout.css';

const Admin = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/products" element={<Products />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/statistics" element={<Statistics />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/" element={<Dashboard />} />
    </Routes>
  );
};

export default Admin;