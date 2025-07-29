import React, { useState, useEffect } from 'react';
import { ShoppingCart, Package, DollarSign, BarChart, TrendingUp } from 'lucide-react';
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
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend }) => (
  <div className="stat-card">
    <div className="stat-icon">
      {icon}
    </div>
    <div className="stat-info">
      <h3 className="stat-title">{title}</h3>
      <p className="stat-value">{value}</p>
      {trend && (
        <div className={`stat-trend ${trend.isUp ? 'up' : 'down'}`}>
          <TrendingUp size={14} />
          <span>{trend.value}% {trend.isUp ? '↑' : '↓'}</span>
        </div>
      )}
    </div>
  </div>
);

const Statistics = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    monthlyRevenue: 0,
    totalRevenue: 0,
    bestSeller: { name: 'Aucun', quantity: 0 }
  });

  // Sample data - replace with actual API calls
  useEffect(() => {
    // Simulate API call
    const fetchStats = async () => {
      try {
        // Replace with actual API calls
        // const response = await fetch('/api/statistics');
        // const data = await response.json();
        
        // Mock data for demonstration
        setTimeout(() => {
          setStats({
            totalOrders: 1245,
            totalProducts: 89,
            monthlyRevenue: 24500,
            totalRevenue: 189500,
            bestSeller: {
              name: 'T-shirt Estilo',
              quantity: 342
            }
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching statistics:', error);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Chart data for orders
  const ordersData = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil'],
    datasets: [
      {
        label: 'Commandes',
        data: [65, 59, 80, 81, 56, 55, 40],
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2,
        tension: 0.4,
        fill: true
      }
    ]
  };

  // Chart data for revenue
  const revenueData = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil'],
    datasets: [
      {
        label: 'Revenu (DA)',
        data: [12000, 15000, 18000, 20000, 19000, 22000, 24500],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true
      }
    ]
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Statistiques des commandes',
      },
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  const revenueChartOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      title: {
        display: true,
        text: 'Revenu mensuel (DA)',
      },
    },
  };

  if (loading) {
    return (
      <div className="admin-container">
        <div className="admin-content">
          <AdminHeader />
          <main className="flex-1 flex items-center justify-center">
            <div className="animate-pulse">Chargement des statistiques...</div>
          </main>
          <AdminFooter />
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-content">
        <AdminHeader />
        <main className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Tableau de bord</h1>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard 
                title="Commandes totales" 
                value={stats.totalOrders.toLocaleString()} 
                icon={<ShoppingCart size={24} className="text-blue-500" />}
                trend={{ value: 12.5, isUp: true }}
              />
              
              <StatCard 
                title="Produits" 
                value={stats.totalProducts} 
                icon={<Package size={24} className="text-green-500" />}
              />
              
              <StatCard 
                title="Revenu ce mois" 
                value={`${stats.monthlyRevenue.toLocaleString()} DA`} 
                icon={<DollarSign size={24} className="text-yellow-500" />}
                trend={{ value: 8.3, isUp: true }}
              />
              
              <StatCard 
                title="Revenu total" 
                value={`${stats.totalRevenue.toLocaleString()} DA`} 
                icon={<BarChart size={24} className="text-purple-500" />}
              />
            </div>
            
            {/* Best Seller */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Produit le plus vendu</h2>
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-lg mr-4">
                  <Package size={32} className="text-blue-500" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">{stats.bestSeller.name}</h3>
                  <p className="text-sm text-gray-500">{stats.bestSeller.quantity} ventes</p>
                </div>
              </div>
            </div>
            
            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-md p-6">
                <Bar options={chartOptions} data={ordersData} />
              </div>
              <div className="bg-white rounded-xl shadow-md p-6">
                <Line options={revenueChartOptions} data={revenueData} />
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
