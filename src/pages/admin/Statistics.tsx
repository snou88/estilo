import React, { useState, useEffect } from 'react';
import { ShoppingCart, Package, DollarSign, BarChart, TrendingUp, TrendingDown, Users, Clock } from 'lucide-react';
import AdminHeader from '../../components/AdminHeader';
import AdminFooter from '../../components/AdminFooter';
import './AdminSection.css';
import './Statistics.css';

// Chart.js components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  LineController,
  BarController
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { getPhpApiUrl } from '../../utils/api';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  LineController,
  BarController
);

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isUp: boolean;
  };
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, color }) => (
  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mb-2">{value}</p>
        {trend && (
          <div className={`flex items-center text-sm ${trend.isUp ? 'text-green-600' : 'text-red-600'}`}>
            {trend.isUp ? <TrendingUp size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1" />}
            <span className="font-medium">{trend.value}%</span>
            <span className="ml-1">{trend.isUp ? '↑' : '↓'}</span>
          </div>
        )}
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        {icon}
      </div>
    </div>
  </div>
);

const Statistics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    total_orders: 0,
    total_products: 0,
    monthly_revenue: 0,
    total_revenue: 0,
    monthly_orders: 0,
    orders_trend: 0,
    revenue_trend: 0,
    best_seller: { name: 'Aucun', quantity: 0 },
    status_distribution: {},
    chart_data: { labels: [], orders: [], revenue: [] }
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch(getPhpApiUrl('api/get_statistics.php'));
        const data = await response.json();
        
        if (data.success) {
          setStats(data.statistics);
        } else {
          setError('Erreur lors du chargement des statistiques');
        }
      } catch (error) {
        setError('Erreur de connexion');
        console.error('Error fetching statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Chart data for orders
  const ordersData = {
    labels: stats.chart_data.labels,
    datasets: [
      {
        label: 'Commandes',
        data: stats.chart_data.orders,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6
      }
    ]
  };

  // Chart data for revenue
  const revenueData = {
    labels: stats.chart_data.labels,
    datasets: [
      {
        label: 'Revenu (DA)',
        data: stats.chart_data.revenue,
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: 'rgb(16, 185, 129)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6
      }
    ]
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: 'bold'
          }
        }
      },
      title: {
        display: true,
        text: 'Évolution des commandes',
        font: {
          size: 16,
          weight: 'bold'
        },
        padding: 20
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          font: {
            size: 12
          }
        }
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          font: {
            size: 12
          }
        }
      }
    }
  };

  const revenueChartOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      title: {
        display: true,
        text: 'Évolution du revenu (DA)',
        font: {
          size: 16,
          weight: 'bold'
        },
        padding: 20
      },
    },
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-DZ', {
      style: 'currency',
      currency: 'DZD'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="admin-layout">
        <div className="admin-main">
          <AdminHeader />
          <main className="admin-content">
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Chargement des statistiques...</p>
              </div>
            </div>
          </main>
          <AdminFooter />
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <div className="admin-main">
        <AdminHeader />
        <main className="admin-content">
          <div className="bg-gray-50 min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Tableau de bord</h1>
                <p className="text-gray-600">Vue d'ensemble de votre activité commerciale</p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm font-medium text-red-800">{error}</p>
                </div>
              )}
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard 
                  title="Commandes totales" 
                  value={stats.total_orders.toLocaleString()} 
                  icon={<ShoppingCart size={24} className="text-white" />}
                  trend={{ value: stats.orders_trend, isUp: stats.orders_trend >= 0 }}
                  color="bg-blue-500"
                />
                
                <StatCard 
                  title="Produits" 
                  value={stats.total_products} 
                  icon={<Package size={24} className="text-white" />}
                  color="bg-green-500"
                />
                
                <StatCard 
                  title="Revenu ce mois" 
                  value={formatPrice(stats.monthly_revenue)} 
                  icon={<DollarSign size={24} className="text-white" />}
                  trend={{ value: stats.revenue_trend, isUp: stats.revenue_trend >= 0 }}
                  color="bg-yellow-500"
                />
                
                <StatCard 
                  title="Revenu total" 
                  value={formatPrice(stats.total_revenue)} 
                  icon={<BarChart size={24} className="text-white" />}
                  color="bg-purple-500"
                />
              </div>
              
              {/* Best Seller & Status Distribution */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Best Seller */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Package className="w-5 h-5 mr-2 text-blue-500" />
                    Produit le plus vendu
                  </h2>
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-4 rounded-xl mr-4">
                      <Package size={32} className="text-blue-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 text-lg">{stats.best_seller.name}</h3>
                      <p className="text-sm text-gray-500">{stats.best_seller.quantity} unités vendues</p>
                    </div>
                  </div>
                </div>

                {/* Status Distribution */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-green-500" />
                    Répartition des commandes
                  </h2>
                  <div className="space-y-3">
                    {Object.entries(stats.status_distribution).map(([status, count]) => (
                      <div key={status} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600 capitalize">
                          {status === 'pending' ? 'En attente' : 
                           status === 'accepted' ? 'Acceptées' :
                           status === 'delivered' ? 'Livrées' : 'Annulées'}
                        </span>
                        <span className="text-sm font-bold text-gray-900">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                  <div className="h-80">
                    <Bar options={chartOptions} data={ordersData} />
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                  <div className="h-80">
                    <Line options={revenueChartOptions} data={revenueData} />
                  </div>
                </div>
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
