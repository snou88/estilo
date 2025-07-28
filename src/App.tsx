import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams,
  Link,
} from "react-router-dom";

// Configuration de React Router
const routerConfig = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  },
};

import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Products from "./pages/Products";
import AboutUs from "./pages/AboutUs";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import ProductDetail from "./pages/ProductDetail";
import CartPage from "./pages/CartPage";
// Admin Pages
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import AdminContact from "./pages/admin/Contact";
import AdminOrders from "./pages/admin/Orders";
import AdminStatistics from "./pages/admin/Statistics";
import AdminSettings from "./pages/admin/Settings";
import Admin from "./pages/admin/Admin";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { SidebarProvider } from "./contexts/SidebarContext";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <SidebarProvider>
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
                        <Route path="/product/:id" element={<ProductDetail />} />
                        <Route path="/about" element={<AboutUs />} />
                        <Route path="/faq" element={<FAQ />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/cart" element={<CartPage />} />
                      </Routes>
                    </main>
                    <Footer />
                  </div>
                }
              />
              {/* Pages admin sans Header/Footer public */}
              <Route path="/admin" element={<Admin />}>
                <Route index element={<AdminDashboard />} />
                <Route path="login" element={<AdminLogin />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="contact" element={<AdminContact />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="statistics" element={<AdminStatistics />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>
            </Routes>
          </Router>
        </SidebarProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
