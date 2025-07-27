import { NavLink, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { X, LayoutDashboard, Package, Mail, MessageCircle, BarChart2, Settings } from 'lucide-react';
import './AdminSidebar.css';
import { useSidebar } from '../contexts/SidebarContext';

const links = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={22} /> },
  { to: '/admin/products', label: 'Produits', icon: <Package size={22} /> },
  { to: '/admin/contact', label: 'Contact', icon: <Mail size={22} /> },
  { to: '/admin/Orders', label: 'Order', icon: <MessageCircle size={22} /> },
  { to: '/admin/statistics', label: 'Statistiques', icon: <BarChart2 size={22} /> },
  { to: '/admin/settings', label: 'Paramètres', icon: <Settings size={22} /> },
];

const AdminSidebar = () => {
  // Ajout d'un try/catch pour capturer les erreurs potentielles
  let sidebarContext;
  try {
    sidebarContext = useSidebar();
    console.log('Sidebar context in AdminSidebar:', {
      isSidebarOpen: sidebarContext?.isSidebarOpen,
      hasToggle: typeof sidebarContext?.toggleSidebar === 'function',
      hasClose: typeof sidebarContext?.closeSidebar === 'function'
    });
  } catch (error) {
    console.error('Error accessing SidebarContext in AdminSidebar:', error);
    // Fournir des valeurs par défaut pour éviter les erreurs
    sidebarContext = {
      isSidebarOpen: false,
      closeSidebar: () => console.warn('closeSidebar not available in AdminSidebar')
    };
  }
  
  const { isSidebarOpen, closeSidebar } = sidebarContext;
  const location = useLocation();
  
  console.log('AdminSidebar - isSidebarOpen:', isSidebarOpen, 'at', new Date().toISOString());

  // Fermer le sidebar lors du changement de route sur mobile
  useEffect(() => {
    closeSidebar();
  }, [location.pathname, closeSidebar]);

  // Empêcher le défilement du corps lorsque le menu est ouvert
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isSidebarOpen]);

  return (
    <>
      {/* Overlay pour les mobiles */}
      {isSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={closeSidebar}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Escape' && closeSidebar()}
        />
      )}
      <aside className={`admin-sidebar ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <button 
          className="md:hidden absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-full p-1"
          onClick={closeSidebar}
          aria-label="Fermer le menu"
        >
          <X size={24} />
        </button>
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
  </>
  );
};

export default AdminSidebar;
