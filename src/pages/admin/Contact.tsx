import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import AdminHeader from '../../components/AdminHeader';
import AdminFooter from '../../components/AdminFooter';
import { Mail, Eye, Trash, Search, Reply } from 'lucide-react';
import '../AdminLayout.css';

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

const Contact = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRead, setFilterRead] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch('/backend/api/admin/contact.php');
      const data = await response.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Erreur lors du chargement des messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewMessage = async (message: ContactMessage) => {
    setSelectedMessage(message);
    setShowMessageModal(true);
    
    // Marquer comme lu
    if (!message.is_read) {
      try {
        await fetch(`/backend/api/admin/contact.php?id=${message.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ is_read: true })
        });
        fetchMessages();
      } catch (error) {
        console.error('Erreur lors de la mise à jour:', error);
      }
    }
  };

  const handleDeleteMessage = async (messageId: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) {
      try {
        const response = await fetch(`/backend/api/admin/contact.php?id=${messageId}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          fetchMessages();
        }
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const handleReply = (message: ContactMessage) => {
    setSelectedMessage(message);
    setReplyText(`Bonjour ${message.name},\n\nMerci pour votre message concernant "${message.subject}".\n\n`);
    setShowReplyModal(true);
  };

  const sendReply = async () => {
    if (!selectedMessage || !replyText.trim()) return;

    try {
      const response = await fetch('/backend/api/admin/send-reply.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          to: selectedMessage.email,
          subject: `Re: ${selectedMessage.subject}`,
          message: replyText,
          original_message_id: selectedMessage.id
        })
      });
      
      if (response.ok) {
        setShowReplyModal(false);
        setReplyText('');
        alert('Réponse envoyée avec succès !');
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      alert('Erreur lors de l\'envoi de la réponse');
    }
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = 
      message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filterRead === 'all' ||
      (filterRead === 'unread' && !message.is_read) ||
      (filterRead === 'read' && message.is_read);
    
    return matchesSearch && matchesFilter;
  });

  const unreadCount = messages.filter(m => !m.is_read).length;

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
            <h1 className="admin-page-title">Messages de Contact</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {unreadCount > 0 && (
                <span style={{
                  background: '#ef4444',
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '0.875rem',
                  fontWeight: '600'
                }}>
                  {unreadCount} non lu(s)
                </span>
              )}
            </div>
          </div>

          {/* Statistiques */}
          <div className="admin-stats-grid">
            <div className="admin-stat-card">
              <div className="admin-stat-value">{messages.length}</div>
              <div className="admin-stat-label">Total Messages</div>
            </div>
            <div className="admin-stat-card">
              <div className="admin-stat-value">{unreadCount}</div>
              <div className="admin-stat-label">Non Lus</div>
            </div>
            <div className="admin-stat-card">
              <div className="admin-stat-value">{messages.filter(m => m.is_read).length}</div>
              <div className="admin-stat-label">Lus</div>
            </div>
            <div className="admin-stat-card">
              <div className="admin-stat-value">
                {messages.filter(m => {
                  const today = new Date();
                  const messageDate = new Date(m.created_at);
                  return messageDate.toDateString() === today.toDateString();
                }).length}
              </div>
              <div className="admin-stat-label">Aujourd'hui</div>
            </div>
          </div>

          {/* Filtres */}
          <div className="admin-card">
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', flex: '1', minWidth: '200px' }}>
                <Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
                <input
                  type="text"
                  placeholder="Rechercher par nom, email ou sujet..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="admin-form-input"
                  style={{ paddingLeft: '44px' }}
                />
              </div>
              <div style={{ minWidth: '150px' }}>
                <select
                  value={filterRead}
                  onChange={(e) => setFilterRead(e.target.value)}
                  className="admin-form-select"
                >
                  <option value="all">Tous</option>
                  <option value="unread">Non lus</option>
                  <option value="read">Lus</option>
                </select>
              </div>
            </div>
          </div>

          {/* Liste des messages */}
          <div className="admin-card">
            {filteredMessages.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>
                Aucun message trouvé
              </div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Statut</th>
                    <th>Nom</th>
                    <th>Email</th>
                    <th>Sujet</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMessages.map(message => (
                    <tr 
                      key={message.id}
                      style={{ 
                        background: message.is_read ? 'transparent' : '#f0f9ff',
                        fontWeight: message.is_read ? 'normal' : '600'
                      }}
                    >
                      <td>
                        <div style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: message.is_read ? '#6b7280' : '#3b82f6'
                        }} />
                      </td>
                      <td>{message.name}</td>
                      <td style={{ color: '#6b7280' }}>{message.email}</td>
                      <td>
                        <div style={{ 
                          maxWidth: '300px', 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {message.subject}
                        </div>
                      </td>
                      <td>{new Date(message.created_at).toLocaleDateString()}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => handleViewMessage(message)}
                            style={{ 
                              background: 'none', 
                              border: 'none', 
                              cursor: 'pointer',
                              padding: '8px',
                              borderRadius: '4px',
                              color: '#3b82f6'
                            }}
                            title="Voir le message"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleReply(message)}
                            style={{ 
                              background: 'none', 
                              border: 'none', 
                              cursor: 'pointer',
                              padding: '8px',
                              borderRadius: '4px',
                              color: '#10b981'
                            }}
                            title="Répondre"
                          >
                            <Reply size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteMessage(message.id)}
                            style={{ 
                              background: 'none', 
                              border: 'none', 
                              cursor: 'pointer',
                              padding: '8px',
                              borderRadius: '4px',
                              color: '#ef4444'
                            }}
                            title="Supprimer"
                          >
                            <Trash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Modal lecture message */}
          {showMessageModal && selectedMessage && (
            <div className="admin-modal">
              <div className="admin-modal-content">
                <div className="admin-modal-header">
                  <h2 className="admin-modal-title">Message de {selectedMessage.name}</h2>
                  <button 
                    className="admin-close-btn"
                    onClick={() => setShowMessageModal(false)}
                  >
                    ×
                  </button>
                </div>
                
                <div style={{ display: 'grid', gap: '16px' }}>
                  <div>
                    <strong>De:</strong> {selectedMessage.name} ({selectedMessage.email})
                  </div>
                  <div>
                    <strong>Sujet:</strong> {selectedMessage.subject}
                  </div>
                  <div>
                    <strong>Date:</strong> {new Date(selectedMessage.created_at).toLocaleString()}
                  </div>
                  <div>
                    <strong>Message:</strong>
                    <div style={{ 
                      background: '#f9fafb', 
                      padding: '16px', 
                      borderRadius: '8px', 
                      marginTop: '8px',
                      whiteSpace: 'pre-wrap'
                    }}>
                      {selectedMessage.message}
                    </div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end', marginTop: '24px' }}>
                  <button
                    onClick={() => setShowMessageModal(false)}
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
                  <button 
                    onClick={() => {
                      setShowMessageModal(false);
                      handleReply(selectedMessage);
                    }}
                    className="admin-btn"
                  >
                    <Reply size={16} style={{ marginRight: '8px' }} />
                    Répondre
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal réponse */}
          {showReplyModal && selectedMessage && (
            <div className="admin-modal">
              <div className="admin-modal-content">
                <div className="admin-modal-header">
                  <h2 className="admin-modal-title">Répondre à {selectedMessage.name}</h2>
                  <button 
                    className="admin-close-btn"
                    onClick={() => setShowReplyModal(false)}
                  >
                    ×
                  </button>
                </div>
                
                <div style={{ display: 'grid', gap: '16px' }}>
                  <div>
                    <strong>À:</strong> {selectedMessage.email}
                  </div>
                  <div>
                    <strong>Sujet:</strong> Re: {selectedMessage.subject}
                  </div>
                  <div>
                    <label className="admin-form-label">Votre réponse:</label>
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="admin-form-textarea"
                      rows={8}
                      placeholder="Tapez votre réponse ici..."
                    />
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end', marginTop: '24px' }}>
                  <button
                    onClick={() => setShowReplyModal(false)}
                    style={{
                      background: '#6b7280',
                      color: 'white',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    Annuler
                  </button>
                  <button 
                    onClick={sendReply}
                    className="admin-btn"
                    disabled={!replyText.trim()}
                  >
                    <Mail size={16} style={{ marginRight: '8px' }} />
                    Envoyer
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

export default Contact;
