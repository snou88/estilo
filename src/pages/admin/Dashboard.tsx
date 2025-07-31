import { useNavigate } from 'react-router-dom';
import AdminHeader from '../../components/AdminHeader';
import { adminIcons } from '../../components/AdminIcons';
import AdminFooter from '../../components/AdminFooter';
import './AdminDashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  return (
    <div className="admin-layout block">
      <AdminHeader />
      <div className="admin-main">
        <div className="admin-content no-sidebar dashboard-page">
          <header className="admin-dashboard-header">
            <h1 className="admin-dashboard-title">Tableau de bord Administrateur</h1>
            <p className="admin-dashboard-subtitle">Gérez votre boutique en toute simplicité</p>
          </header>
          
          <div className="dashboard-grid">
            {adminIcons.map((item) => {
              const Icon = item.icon;
              return (
                <div 
                  key={item.label}
                  className="dashboard-card"
                  onClick={() => navigate(item.to)}
                >
                  <div className="dashboard-icon">
                    <Icon size={24} />
                  </div>
                  <h3>{item.label}</h3>
                  <p>Gérer cette section</p>
                </div>
              );
            })}
          </div>
          
          <div className="dashboard-logo-section">
            <img 
              src="/estilo.svg" 
              alt="Estilo Logo" 
              className="dashboard-logo"
            />
          </div>
        </div>
      </div>
      <AdminFooter />
    </div>
  );
};

export default Dashboard;
