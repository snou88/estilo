import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminHeader from '../../components/AdminHeader';
import AdminSidebar from '../../components/AdminSidebar';
import AdminFooter from '../../components/AdminFooter';
import { Package, ShoppingCart, Users, TrendingUp, Mail, Eye } from 'lucide-react';
import './AdminDashboard.css';

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  pendingOrders: number;
  newMessages: number;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    newMessages: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch dashboard statistics
      const statsResponse = await fetch('/backend/api/admin/dashboard-stats.php');
      const statsData = await statsResponse.json();
      setStats(statsData);

      // Fetch recent orders
      const ordersResponse = await fetch('/backend/api/admin/recent-orders.php');
      const ordersData = await ordersResponse.json();
      setRecentOrders(ordersData);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { 
      label: 'Produits', 
      icon: Package, 
      color: '#3b82f6', 
      to: '/admin/products',
      count: stats.totalProducts
    },
    { 
      label: 'Commandes', 
      icon: ShoppingCart, 
      color: '#10b981', 
      to: '/admin/orders',
      count: stats.totalOrders
    },
    { 
      label: 'Utilisateurs', 
      icon: Users, 
      color: '#f59e0b', 
      to: '/admin/users',
      count: stats.totalUsers
    },
    { 
      label: 'Statistiques', 
      icon: BarChart2, 
      color: '#8b5cf6', 
      to: '/admin/statistics',
      count: `${stats.totalRevenue}€`
    }
  ];

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader />
        <main className="admin-content">
          <div className="admin-page-header">
            <h1 className="admin-page-title">Dashboard</h1>
          </div>

          {/* Statistics Cards */}
          <div className="admin-stats-grid">
            <div className="admin-stat-card">
              <div className="admin-stat-value">{stats.totalProducts}</div>
              <div className="admin-stat-label">Produits Total</div>
            </div>
            <div className="admin-stat-card">
              <div className="admin-stat-value">{stats.totalOrders}</div>
              <div className="admin-stat-label">Commandes Total</div>
            </div>
            <div className="admin-stat-card">
              <div className="admin-stat-value">{stats.pendingOrders}</div>
              <div className="admin-stat-label">Commandes en Attente</div>
            </div>
            <div className="admin-stat-card">
              <div className="admin-stat-value">{stats.totalRevenue}€</div>
              <div className="admin-stat-label">Chiffre d'Affaires</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="admin-card">
            <h3 style={{ marginBottom: '24px', fontSize: '1.25rem', fontWeight: '600' }}>Actions Rapides</h3>
            <div className="admin-dashboard-circles">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <div
                    key={action.label}
                    className="dashboard-circle"
                    style={{ backgroundColor: action.color }}
                    onClick={() => navigate(action.to)}
                  >
                    <span className="dashboard-icon">
                      <Icon size={32} />
                    </span>
                    <span className="dashboard-label">{action.label}</span>
                    <span className="dashboard-count">{action.count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Orders */}
          <div className="admin-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>Commandes Récentes</h3>
              <button 
                className="admin-btn"
                onClick={() => navigate('/admin/orders')}
              >
                <Eye size={16} style={{ marginRight: '8px' }} />
                Voir Tout
              </button>
            </div>
            
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                Chargement...
              </div>
            ) : recentOrders.length > 0 ? (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Client</th>
                    <th>Montant</th>
                    <th>Statut</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.slice(0, 5).map((order: any) => (
                    <tr key={order.id}>
                      <td>#{order.id}</td>
                      <td>{order.customer_name}</td>
                      <td>{order.total_amount}€</td>
                      <td>
                        <span className={`status-badge status-${order.status}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>{new Date(order.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                Aucune commande récente
              </div>
            )}
          </div>

          {/* Recent Messages */}
          <div className="admin-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>Messages Récents</h3>
              <button 
                className="admin-btn"
                onClick={() => navigate('/admin/contact')}
              >
                <Mail size={16} style={{ marginRight: '8px' }} />
                Voir Tout
              </button>
            </div>
            
            <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
              {stats.newMessages > 0 ? `${stats.newMessages} nouveaux messages` : 'Aucun nouveau message'}
            </div>
          </div>
        </main>
        <AdminFooter />
      </div>
    </div>
  );
};

export default Dashboard;
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
