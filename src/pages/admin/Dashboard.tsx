import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminHeader from '../../components/AdminHeader';
import AdminSidebar from '../../components/AdminSidebar';
import { adminIcons } from '../../components/AdminIcons';
import AdminFooter from '../../components/AdminFooter';
import './AdminDashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  return (
    <div className="admin-layout">
      <div className="admin-main">
        <AdminHeader />
        <main className="admin-content">
          <h2 className="admin-dashboard-title">Dashboard Admin</h2>
          <div className="admin-dashboard-circles">
            {adminIcons.map((circle) => {
              const Icon = circle.icon;
              return (
                <div
                  key={circle.label}
                  className="dashboard-circle dashboard-circle-large"
                  style={{ backgroundColor: circle.color }}
                  onClick={() => navigate(circle.to)}
                >
                  <span className="dashboard-icon">
                    <Icon size={48} />
                  </span>
                  <span className="dashboard-label">{circle.label}</span>
                </div>
              );
            })}
          </div>
        </main>
        <AdminFooter />
      </div>
    </div>
  );
};

export default Dashboard;
