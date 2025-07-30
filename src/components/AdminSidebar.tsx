import { NavLink } from 'react-router-dom';
import { useEffect } from 'react';
import { X, LayoutDashboard, Package, Mail, MessageCircle, BarChart2, Settings, MapPin, Tags } from 'lucide-react';
import './AdminSidebar.css';
import { useSidebar } from '../contexts/SidebarContext';

const links = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={22} /> },
  { to: '/admin/products', label: 'Produits', icon: <Package size={22} /> },
  { to: '/admin/categorie-and-size', label: 'Catégories & Tailles', icon: <Tags size={22} /> },
  { to: '/admin/contact', label: 'Contact', icon: <Mail size={22} /> },
  { to: '/admin/orders', label: 'Orders', icon: <MessageCircle size={22} /> },
  { to: '/admin/wilayas', label: 'Wilayas', icon: <MapPin size={22} /> },
  { to: '/admin/statistics', label: 'Statistiques', icon: <BarChart2 size={22} /> },
  { to: '/admin/settings', label: 'Paramètres', icon: <Settings size={22} /> },
];

const AdminSidebar: React.FC = () => {
  const { isSidebarOpen, closeSidebar } = useSidebar();

  // close on escape or click-away
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && closeSidebar();
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [closeSidebar]);

  // prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [isSidebarOpen]);

  return (
    <>
      {/* backdrop on mobile */}
      {isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={closeSidebar}
        />
      )}

      <aside className={`admin-sidebar ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <button
          className="md:hidden absolute top-4 right-4 p-1 rounded-full text-gray-500 hover:text-gray-700"
          onClick={closeSidebar}
          aria-label="Fermer le menu"
        >
          <X size={24} />
        </button>

        

        <nav className="admin-sidebar-nav">
          {links.map(link => (
            <NavLink
              to={link.to}
              className={({ isActive }) =>
                'admin-sidebar-link' + (isActive ? ' active' : '')
              }
              key={link.to}
              onClick={() => {
                /* on mobile, clicking a link should close */
                closeSidebar();
              }}
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
