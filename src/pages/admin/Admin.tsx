import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminSidebar from '../../components/AdminSidebar';
import AdminHeader from '../../components/AdminHeader';
import { SidebarProvider } from '../../contexts/SidebarContext';
import '../../pages/admin/AdminDashboard.css';

const Admin: React.FC = () => {
  const { isAuthenticated } = useAuth(); 

  if (!isAuthenticated) {
    return <Navigate to="/Admin/login" replace />;
  }

  return (
    <SidebarProvider>
      <div className="admin-layout">
        <AdminSidebar />
        <div className="admin-content">
          <AdminHeader />
          <main className="admin-main">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Admin;
