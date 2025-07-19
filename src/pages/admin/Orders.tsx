import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import AdminHeader from '../../components/AdminHeader';
import AdminFooter from '../../components/AdminFooter';
import { Eye, Edit, Search, Filter, Download } from 'lucide-react';
import '../AdminLayout.css';

interface Order {
  id: number;
  user_id: number;
  customer_name: string;
  customer_email: string;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  created_at: string;
  items_count: number;
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/backend/api/admin/orders.php');
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Erreur lors du chargement des commandes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetails = async (orderId: number) => {
    try {
      const response = await fetch(`/backend/api/admin/orders.php?id=${orderId}`);
      const data = await response.json();
      setOrderDetails(data);
    } catch (error) {
      console.error('Erreur lors du chargement des détails:', error);
    }
  };

  const handleViewOrder = async (order: Order) => {
    setSelectedOrder(order);
    await fetchOrderDetails(order.id);
    setShowOrderModal(true);
  };

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      const response = await fetch(`/backend/api/admin/orders.php?id=${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        fetchOrders();
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toString().includes(searchTerm);
    const matchesStatus = statusFilter === '' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'processing': return '#3b82f6';
      case 'shipped': return '#10b981';
      case 'delivered': return '#059669';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'processing': return 'En cours';
      case 'shipped': return 'Expédiée';
      case 'delivered': return 'Livrée';
      case 'cancelled': return 'Annulée';
      default: return status;
    }
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
            <h1 className="admin-page-title">Gestion des Commandes</h1>
            <button className="admin-btn">
              <Download size={16} style={{ marginRight: '8px' }} />
              Exporter
            </button>
          </div>

          {/* Statistiques rapides */}
          <div className="admin-stats-grid">
            <div className="admin-stat-card">
              <div className="admin-stat-value">{orders.length}</div>
              <div className="admin-stat-label">Total Commandes</div>
            </div>
            <div className="admin-stat-card">
              <div className="admin-stat-value">{orders.filter(o => o.status === 'pending').length}</div>
              <div className="admin-stat-label">En Attente</div>
            </div>
            <div className="admin-stat-card">
              <div className="admin-stat-value">{orders.filter(o => o.status === 'processing').length}</div>
              <div className="admin-stat-label">En Cours</div>
            </div>
            <div className="admin-stat-card">
              <div className="admin-stat-value">
                {orders.reduce((sum, order) => sum + order.total_amount, 0).toFixed(2)}€
              </div>
              <div className="admin-stat-label">Chiffre d'Affaires</div>
            </div>
          </div>

          {/* Filtres */}
          <div className="admin-card">
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', flex: '1', minWidth: '200px' }}>
                <Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
                <input
                  type="text"
                  placeholder="Rechercher par nom, email ou ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="admin-form-input"
                  style={{ paddingLeft: '44px' }}
                />
              </div>
              <div style={{ minWidth: '150px' }}>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="admin-form-select"
                >
                  <option value="">Tous les statuts</option>
                  <option value="pending">En attente</option>
                  <option value="processing">En cours</option>
                  <option value="shipped">Expédiée</option>
                  <option value="delivered">Livrée</option>
                  <option value="cancelled">Annulée</option>
                </select>
              </div>
            </div>
          </div>

          {/* Liste des commandes */}
          <div className="admin-card">
            {filteredOrders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>
                Aucune commande trouvée
              </div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Client</th>
                    <th>Email</th>
                    <th>Articles</th>
                    <th>Montant</th>
                    <th>Statut</th>
                    <th>Paiement</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(order => (
                    <tr key={order.id}>
                      <td style={{ fontWeight: '600' }}>#{order.id}</td>
                      <td>{order.customer_name}</td>
                      <td style={{ color: '#6b7280' }}>{order.customer_email}</td>
                      <td>{order.items_count} article(s)</td>
                      <td style={{ fontWeight: '600', color: '#3b82f6' }}>{order.total_amount}€</td>
                      <td>
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          style={{
                            background: getStatusColor(order.status),
                            color: 'white',
                            border: 'none',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: '600'
                          }}
                        >
                          <option value="pending">En attente</option>
                          <option value="processing">En cours</option>
                          <option value="shipped">Expédiée</option>
                          <option value="delivered">Livrée</option>
                          <option value="cancelled">Annulée</option>
                        </select>
                      </td>
                      <td>
                        <span className={`status-badge status-${order.payment_status}`}>
                          {order.payment_status === 'paid' ? 'Payé' : 
                           order.payment_status === 'pending' ? 'En attente' :
                           order.payment_status === 'failed' ? 'Échoué' : 'Remboursé'}
                        </span>
                      </td>
                      <td>{new Date(order.created_at).toLocaleDateString()}</td>
                      <td>
                        <button
                          onClick={() => handleViewOrder(order)}
                          style={{ 
                            background: 'none', 
                            border: 'none', 
                            cursor: 'pointer',
                            padding: '8px',
                            borderRadius: '4px',
                            color: '#3b82f6'
                          }}
                          title="Voir les détails"
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Modal détails commande */}
          {showOrderModal && selectedOrder && orderDetails && (
            <div className="admin-modal">
              <div className="admin-modal-content" style={{ maxWidth: '700px' }}>
                <div className="admin-modal-header">
                  <h2 className="admin-modal-title">Commande #{selectedOrder.id}</h2>
                  <button 
                    className="admin-close-btn"
                    onClick={() => setShowOrderModal(false)}
                  >
                    ×
                  </button>
                </div>
                
                <div style={{ display: 'grid', gap: '24px' }}>
                  {/* Informations client */}
                  <div>
                    <h3 style={{ marginBottom: '12px', fontSize: '1.1rem', fontWeight: '600' }}>
                      Informations Client
                    </h3>
                    <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '8px' }}>
                      <p><strong>Nom:</strong> {selectedOrder.customer_name}</p>
                      <p><strong>Email:</strong> {selectedOrder.customer_email}</p>
                      <p><strong>Date:</strong> {new Date(selectedOrder.created_at).toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Articles commandés */}
                  <div>
                    <h3 style={{ marginBottom: '12px', fontSize: '1.1rem', fontWeight: '600' }}>
                      Articles Commandés
                    </h3>
                    <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ background: '#f9fafb' }}>
                          <tr>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Produit</th>
                            <th style={{ padding: '12px', textAlign: 'center' }}>Quantité</th>
                            <th style={{ padding: '12px', textAlign: 'right' }}>Prix</th>
                            <th style={{ padding: '12px', textAlign: 'right' }}>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orderDetails.items?.map((item: any, index: number) => (
                            <tr key={index} style={{ borderTop: '1px solid #e5e7eb' }}>
                              <td style={{ padding: '12px' }}>
                                <div>
                                  <div style={{ fontWeight: '600' }}>{item.product_name}</div>
                                  {item.size && <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                    Taille: {item.size}
                                  </div>}
                                  {item.color && <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                    Couleur: {item.color}
                                  </div>}
                                </div>
                              </td>
                              <td style={{ padding: '12px', textAlign: 'center' }}>{item.quantity}</td>
                              <td style={{ padding: '12px', textAlign: 'right' }}>{item.unit_price}€</td>
                              <td style={{ padding: '12px', textAlign: 'right', fontWeight: '600' }}>
                                {item.total_price}€
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot style={{ background: '#f9fafb', borderTop: '2px solid #e5e7eb' }}>
                          <tr>
                            <td colSpan={3} style={{ padding: '12px', fontWeight: '600' }}>Total</td>
                            <td style={{ padding: '12px', textAlign: 'right', fontWeight: '700', fontSize: '1.1rem' }}>
                              {selectedOrder.total_amount}€
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>

                  {/* Adresse de livraison */}
                  {orderDetails.shipping_address && (
                    <div>
                      <h3 style={{ marginBottom: '12px', fontSize: '1.1rem', fontWeight: '600' }}>
                        Adresse de Livraison
                      </h3>
                      <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '8px' }}>
                        <pre style={{ whiteSpace: 'pre-wrap', margin: 0, fontFamily: 'inherit' }}>
                          {orderDetails.shipping_address}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
                
                <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end', marginTop: '24px' }}>
                  <button
                    onClick={() => setShowOrderModal(false)}
                    style={{
                      background: '#6b7280',
                      color: 'white',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    Fermer
                  </button>
                  <button className="admin-btn">
                    Imprimer
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
        <AdminFooter />
      </div>
    </div>
  );
};

export default Orders;
