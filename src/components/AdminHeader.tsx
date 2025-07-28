import { useState } from 'react';
import { LogOut, Menu } from 'lucide-react';
import './AdminHeader.css';
import { useSidebar } from '../contexts/SidebarContext';

const ADMIN_NAME = 'Estilo Admin';

const AdminHeader: React.FC = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { isSidebarOpen, toggleSidebar } = useSidebar();

  const handleMenuClick = () => {
    toggleSidebar();
  };

  const handleLogout = async () => {
    localStorage.removeItem('admin_token');
    try {
      await fetch('http://localhost/estilo/admin/logout.php', {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
      /* ignore */
    }
    window.location.href = '/admin/login';
  };

  return (
    <>
      <header className="admin-header-bar">
        <div className="admin-header-bar-inner">
          <div className="flex items-center">
            {/* Only visible on small screens */}
            <button
              id="hamburger-button"
              className="flex md:hidden mr-4 text-gray-600 hover:text-gray-900"
              onClick={handleMenuClick}
              aria-label="Toggle menu"
            >
              <Menu size={24} />
            </button>
            <div className="admin-header-logo">
              <img src="/estilo.svg" alt="Estilo Admin" />
            </div>
          </div>
          <div className="admin-header-user">
            <span className="admin-header-username">{ADMIN_NAME}</span>
            <button
              className="admin-header-logout-btn"
              onClick={() => setShowLogoutModal(true)}
              title="Déconnexion"
            >
              <LogOut size={21} />
            </button>
          </div>
        </div>
      </header>

      {showLogoutModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadein"
          onClick={() => setShowLogoutModal(false)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md mx-4 animate-fadein"
            onClick={e => e.stopPropagation()}
          >
            <div className="text-lg font-semibold mb-4 text-gray-800">
              Voulez-vous vraiment vous déconnecter ?
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button
                className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                onClick={handleLogout}
              >
                Confirmer
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition"
                onClick={() => setShowLogoutModal(false)}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminHeader;
