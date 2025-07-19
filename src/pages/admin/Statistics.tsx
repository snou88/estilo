import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import AdminHeader from '../../components/AdminHeader';
import AdminFooter from '../../components/AdminFooter';
import { TrendingUp, TrendingDown, Users, Package, ShoppingCart, Euro } from 'lucide-react';
import '../AdminLayout.css';

interface Statistics {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  monthlyRevenue: number[];
  monthlyOrders: number[];
  topProducts: Array<{
    name: string;
    sales: number;
    revenue: number;
  }>;
  recentStats: {
    revenueGrowth: number;
    ordersGrowth: number;
    usersGrowth: number;
  };
}

const Statistics = () => {
  const [stats, setStats] = useState<Statistics>({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    monthlyRevenue: [],
    monthlyOrders: [],
    topProducts: [],
    recentStats: {
      revenueGrowth: 0,
      ordersGrowth: 0,
      usersGrowth: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  useEffect(() => {
    fetchStatistics();
  }, [selectedPeriod]);

  const fetchStatistics = async () => {
    try {
      const response = await fetch(`/backend/api/admin/statistics.php?period=${selectedPeriod}`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };

  const getGrowthColor = (value: number) => {
    return value >= 0 ? '#10b981' : '#ef4444';
  };

  const getGrowthIcon = (value: number) => {
    return value >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />;
  };

  if (loading) {
    return (
      <div className="admin-layout">
        <AdminSidebar />
        <div className="admin-main">
          <AdminHeader />
          <main className="admin-content">
            <div style={{ textAlign: 'center', padding: '60px' }}>Chargement...</div>
          </main>
          <AdminFooter />
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader />
        <main className="admin-content">
          <div className="admin-page-header">
            <h1 className="admin-page-title">Statistiques</h1>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="admin-form-select"
              style={{ width: 'auto' }}
            >
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
              <option value="quarter">Ce trimestre</option>
              <option value="year">Cette année</option>
            </select>
          </div>

          {/* Statistiques principales */}
          <div className="admin-stats-grid">
            <div className="admin-stat-card" style={{ borderLeftColor: '#3b82f6' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div className="admin-stat-value">{formatCurrency(stats.totalRevenue)}</div>
                  <div className="admin-stat-label">Chiffre d'Affaires</div>
                </div>
                <Euro size={24} style={{ color: '#3b82f6' }} />
              </div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '4px', 
                marginTop: '8px',
                color: getGrowthColor(stats.recentStats.revenueGrowth),
                fontSize: '0.875rem',
                fontWeight: '600'
              }}>
                {getGrowthIcon(stats.recentStats.revenueGrowth)}
                {formatPercentage(stats.recentStats.revenueGrowth)}
              </div>
            </div>

            <div className="admin-stat-card" style={{ borderLeftColor: '#10b981' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div className="admin-stat-value">{stats.totalOrders}</div>
                  <div className="admin-stat-label">Commandes</div>
                </div>
                <ShoppingCart size={24} style={{ color: '#10b981' }} />
              </div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '4px', 
                marginTop: '8px',
                color: getGrowthColor(stats.recentStats.ordersGrowth),
                fontSize: '0.875rem',
                fontWeight: '600'
              }}>
                {getGrowthIcon(stats.recentStats.ordersGrowth)}
                {formatPercentage(stats.recentStats.ordersGrowth)}
              </div>
            </div>

            <div className="admin-stat-card" style={{ borderLeftColor: '#f59e0b' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div className="admin-stat-value">{stats.totalProducts}</div>
                  <div className="admin-stat-label">Produits</div>
                </div>
                <Package size={24} style={{ color: '#f59e0b' }} />
              </div>
              <div style={{ 
                fontSize: '0.875rem',
                color: '#6b7280',
                marginTop: '8px'
              }}>
                Catalogue total
              </div>
            </div>

            <div className="admin-stat-card" style={{ borderLeftColor: '#8b5cf6' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div className="admin-stat-value">{stats.totalUsers}</div>
                  <div className="admin-stat-label">Utilisateurs</div>
                </div>
                <Users size={24} style={{ color: '#8b5cf6' }} />
              </div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '4px', 
                marginTop: '8px',
                color: getGrowthColor(stats.recentStats.usersGrowth),
                fontSize: '0.875rem',
                fontWeight: '600'
              }}>
                {getGrowthIcon(stats.recentStats.usersGrowth)}
                {formatPercentage(stats.recentStats.usersGrowth)}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
            {/* Graphique des ventes */}
            <div className="admin-card">
              <h3 style={{ marginBottom: '24px', fontSize: '1.25rem', fontWeight: '600' }}>
                Évolution des Ventes
              </h3>
              
              {/* Graphique simple avec barres CSS */}
              <div style={{ display: 'flex', alignItems: 'end', gap: '8px', height: '200px', padding: '20px 0' }}>
                {stats.monthlyRevenue.map((revenue, index) => {
                  const maxRevenue = Math.max(...stats.monthlyRevenue);
                  const height = maxRevenue > 0 ? (revenue / maxRevenue) * 160 : 0;
                  
                  return (
                    <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div
                        style={{
                          width: '100%',
                          height: `${height}px`,
                          background: 'linear-gradient(to top, #3b82f6, #60a5fa)',
                          borderRadius: '4px 4px 0 0',
                          marginBottom: '8px',
                          transition: 'all 0.3s ease'
                        }}
                        title={`${formatCurrency(revenue)}`}
                      />
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                        {new Date(2024, index).toLocaleDateString('fr-FR', { month: 'short' })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top produits */}
            <div className="admin-card">
              <h3 style={{ marginBottom: '24px', fontSize: '1.25rem', fontWeight: '600' }}>
                Produits les Plus Vendus
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {stats.topProducts.slice(0, 5).map((product, index) => (
                  <div key={index} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '12px',
                    background: '#f9fafb',
                    borderRadius: '8px'
                  }}>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>
                        {product.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                        {product.sales} ventes
                      </div>
                    </div>
                    <div style={{ fontWeight: '600', color: '#3b82f6' }}>
                      {formatCurrency(product.revenue)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Métriques détaillées */}
          <div className="admin-card">
            <h3 style={{ marginBottom: '24px', fontSize: '1.25rem', fontWeight: '600' }}>
              Métriques Détaillées
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937', marginBottom: '4px' }}>
                  {stats.totalOrders > 0 ? formatCurrency(stats.totalRevenue / stats.totalOrders) : '0€'}
                </div>
                <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Panier Moyen</div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937', marginBottom: '4px' }}>
                  {stats.totalUsers > 0 ? (stats.totalOrders / stats.totalUsers).toFixed(1) : '0'}
                </div>
                <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Commandes par Client</div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937', marginBottom: '4px' }}>
                  {((stats.totalOrders / Math.max(stats.totalUsers, 1)) * 100).toFixed(1)}%
                </div>
                <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Taux de Conversion</div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937', marginBottom: '4px' }}>
                  {stats.monthlyRevenue.length > 1 ? 
                    formatCurrency(stats.monthlyRevenue[stats.monthlyRevenue.length - 1]) : 
                    '0€'
                  }
                </div>
                <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Dernier Mois</div>
              </div>
            </div>
          </div>
        </main>
        <AdminFooter />
      </div>
    </div>
  );
};

export default Statistics;
