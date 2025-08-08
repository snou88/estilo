import { useState, useEffect } from 'react';
import AdminHeader from '../../components/AdminHeader';
import AdminFooter from '../../components/AdminFooter';
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import './AdminSection.css';
import { getAdminPhpApiUrl } from '../../utils/api';

interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  size?: string;
  color?: string;
}

interface Order {
  id: number;
  customer_name: string;
  customer_phone: string;
  shipping_address: string;
  shipping_city: string;
  shipping_zip: string;
  wilaya_id: number;
  wilaya_name: string;
  wilaya_shipping_price: number;
  shipping_price: number;
  total_amount: number;
  status: 'pending' | 'accepted' | 'cancelled' | 'delivered';
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

const PAGE_SIZE = 3;

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  const [statusLoading, setStatusLoading] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(getAdminPhpApiUrl('api/get_orders_with_items.php'));
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des commandes');
      }
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (err) {
      setError('Erreur lors du chargement des commandes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: number, newStatus: Order['status']) => {
    try {
      setStatusLoading(orderId);
      const response = await fetch(getAdminPhpApiUrl('api/update_order_status.php'), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: orderId, status: newStatus })
      });

      const data = await response.json();

      if (response.ok) {
        setOrders(prev => prev.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        ));
        setSuccessMessage('Statut de la commande mis à jour avec succès');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        throw new Error(data.error || 'Erreur lors de la mise à jour');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
    } finally {
      setStatusLoading(null);
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'accepted':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'delivered':
        return <Truck className="h-4 w-4 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Package className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'accepted':
        return 'Acceptée';
      case 'delivered':
        return 'Livrée';
      case 'cancelled':
        return 'Annulée';
      default:
        return status;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'accepted':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-DZ', {
      style: 'currency',
      currency: 'DZD'
    }).format(price);
  };

  const toggleOrderExpansion = (orderId: number) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  // Pagination
  const pageCount = Math.ceil(orders.length / PAGE_SIZE) || 1;
  const paginatedOrders = orders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  useEffect(() => { if (page > pageCount) setPage(pageCount); }, [pageCount]);

  if (loading) {
    return (
      <div className="admin-layout">
        <div className="admin-main">
          <AdminHeader />
          <main className="admin-content">
            <div className="flex items-center justify-center min-h-screen">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des Commandes</h1>
                    <p className="text-gray-600">Suivez et gérez toutes les commandes de vos clients</p>
                  </div>
                  <button
                    onClick={fetchOrders}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Actualiser
                  </button>
                </div>
              </div>

              {/* Messages de succès/erreur */}
              {successMessage && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-800">{successMessage}</p>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-red-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-red-800">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Statistiques */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Package className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Total Commandes</p>
                      <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Clock className="h-8 w-8 text-yellow-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">En Attente</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {orders.filter(o => o.status === 'pending').length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Livrées</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {orders.filter(o => o.status === 'delivered').length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Truck className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Acceptées</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {orders.filter(o => o.status === 'accepted').length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Liste des commandes */}
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune commande</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Aucune commande n'a été passée pour le moment.
                    </p>
                  </div>
                ) : paginatedOrders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune commande</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Aucune commande n'a été passée pour le moment.
                    </p>
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {paginatedOrders.map((order) => (
                      <li key={order.id} className="px-6 py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="flex-shrink-0">
                                  {getStatusIcon(order.status)}
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">
                                    Commande #{order.id}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center space-x-4">
                                <div className="text-right">
                                  <p className="text-sm font-medium text-gray-900">
                                    {formatPrice(order.total_amount)}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {order.items.length} article(s)
                                  </p>
                                </div>

                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                                  {getStatusText(order.status)}
                                </span>

                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => toggleOrderExpansion(order.id)}
                                    className="text-gray-400 hover:text-gray-600"
                                  >
                                    {expandedOrder === order.id ? (
                                      <ChevronUp className="h-5 w-5" />
                                    ) : (
                                      <ChevronDown className="h-5 w-5" />
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>

                            <div className="mt-2 text-sm text-gray-500">
                              <p>Créée le {order.created_at}</p>
                              <p>Téléphone: {order.customer_phone}</p>
                            </div>
                          </div>
                        </div>

                        {/* Détails de la commande */}
                        {expandedOrder === order.id && (
                          <div className="mt-4 border-t border-gray-200 pt-4">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                              {/* Informations client */}
                              <div>
                                <h4 className="text-sm font-medium text-gray-900 mb-3">Informations client</h4>
                                <div className="space-y-2 text-sm text-gray-600">
                                  <p><span className="font-medium">Nom:</span> {order.customer_name}</p>
                                  <p><span className="font-medium">Téléphone:</span> {order.customer_phone}</p>
                                  <p><span className="font-medium">Adresse:</span> {order.shipping_address}</p>
                                  <p><span className="font-medium">Ville:</span> {order.shipping_city} {order.shipping_zip}</p>
                                  {order.wilaya_name && (
                                    <p><span className="font-medium">Wilaya:</span> {order.wilaya_name}</p>
                                  )}
                                </div>
                              </div>
                              {/* Articles de la commande */}
                              <div>
                                <h4 className="text-sm font-medium text-gray-900 mb-3">Articles commandés</h4>
                                <div className="space-y-2">
                                  {order.items.map((item) => (
                                    <div key={item.id} className="flex justify-between text-sm">
                                      <span className="text-gray-600 flex items-center gap-2">
                                        <span>{item.quantity}x {item.product_name}</span>
                                        {item.size && (
                                          <span className="text-xs text-blue-700 font-semibold bg-blue-50 px-2 py-1 rounded">[{item.size}]</span>
                                        )}
                                        {item.color && (
                                          <div className="flex items-center gap-1">
                                            <div 
                                              className="w-4 h-4 rounded border border-gray-300 shadow-sm" 
                                              style={{ backgroundColor: item.color }}
                                              title={item.color}
                                            />
                                            <span className="text-xs text-gray-500">{item.color}</span>
                                          </div>
                                        )}
                                      </span>
                                      <span className="font-medium">
                                        {formatPrice(item.total_price)}
                                      </span>
                                    </div>
                                  ))}
                                  <div className="border-t border-gray-200 pt-2 mt-2">
                                    <div className="flex justify-between text-sm">
                                      <span className="text-gray-600">Sous-total</span>
                                      <span className="font-medium">
                                        {formatPrice(Number(Number(order.total_amount) - Number(order.wilaya_shipping_price)))}
                                      </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                      <span className="text-gray-600">Livraison</span>
                                      <span className="font-medium">
                                        {formatPrice(order.wilaya_shipping_price)}
                                      </span>
                                    </div>
                                    <div className="flex justify-between text-sm font-bold">
                                      <span>Total</span>
                                      <span>{formatPrice(order.total_amount)}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="mt-6 flex items-center justify-between">
                              <div className="text-sm text-gray-500">
                                Dernière mise à jour: {order.updated_at}
                              </div>

                              <div className="flex items-center space-x-2">
                                {order.status === 'pending' && (
                                  <>
                                    <button
                                      onClick={() => updateOrderStatus(order.id, 'accepted')}
                                      disabled={statusLoading === order.id}
                                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                    >
                                      {statusLoading === order.id ? '...' : 'Accepter'}
                                    </button>
                                    <button
                                      onClick={() => updateOrderStatus(order.id, 'cancelled')}
                                      disabled={statusLoading === order.id}
                                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                                    >
                                      {statusLoading === order.id ? '...' : 'Annuler'}
                                    </button>
                                  </>
                                )}

                                {order.status === 'accepted' && (
                                  <button
                                    onClick={() => updateOrderStatus(order.id, 'delivered')}
                                    disabled={statusLoading === order.id}
                                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                                  >
                                    {statusLoading === order.id ? '...' : 'Marquer comme livrée'}
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              
              {/* Pagination */}
              {orders.length > PAGE_SIZE && (
                <div className="flex justify-between items-center mt-6 px-6 py-4 bg-white border-t border-gray-200">
                  <button 
                    disabled={page <= 1} 
                    onClick={() => setPage(p => p - 1)} 
                    className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Précédent
                  </button>
                  <span className="text-sm text-gray-700">
                    Page {page} sur {pageCount} ({orders.length} commande{orders.length > 1 ? 's' : ''})
                  </span>
                  <button 
                    disabled={page >= pageCount} 
                    onClick={() => setPage(p => p + 1)} 
                    className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Suivant
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
        <AdminFooter />
      </div>
    </div>
  );
};

export default Orders;
