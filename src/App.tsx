import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Configuration de React Router
const routerConfig = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
};

import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import AboutUs from './pages/AboutUs';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
// Admin Pages
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminContact from './pages/admin/Contact';
import AdminComments from './pages/admin/Comments';
import AdminStatistics from './pages/admin/Statistics';
import AdminSettings from './pages/admin/Settings';
import Admin from './pages/admin/Admin';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
    <Router {...routerConfig}>
      <Routes>
        {/* Public pages avec Header/Footer */}
        <Route
          path="*"
          element={
            <div className="min-h-screen bg-white text-black">
              <Header />
              <main>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/about" element={<AboutUs />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/contact" element={<Contact />} />
                </Routes>
              </main>
              <Footer />
            </div>
          }
        />
        {/* Pages admin sans Header/Footer public */}
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/contact" element={<AdminContact />} />
        <Route path="/admin/comments" element={<AdminComments />} />
        <Route path="/admin/statistics" element={<AdminStatistics />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
      </Routes>
    </Router>
    </AuthProvider>
      );
}

export default App;