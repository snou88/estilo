import React, { useEffect, useState } from 'react';
import AdminHeader from '../../components/AdminHeader';
import AdminFooter from '../../components/AdminFooter';
import './AdminSection.css';

// Define the type for a contact message (adjust fields as needed)
type ContactMessage = {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
};

const Contact = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('admin_token');
        const response = await fetch('http://localhost/estilo/admin/get_all_contact_messages.php', {
          headers: {
            'Authorization': token || ''
          }
        });
        const data = await response.json();
        if (response.ok) {
          setMessages(data.contact_messages || []);
        } else {
          setError(data.error || 'Erreur lors du chargement des messages');
        }
      } catch (err) {
        setError('Erreur réseau ou serveur');
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  return (
    <div className="admin-section-bg">
      <AdminHeader />
      <div className="admin-section-container">
        <h2>Gestion des Contacts</h2>
        {loading ? (
          <div>Chargement...</div>
        ) : error ? (
          <div className="admin-login-error">{error}</div>
        ) : messages.length === 0 ? (
          <div>Aucun message de contact trouvé.</div>
        ) : (
          <div className="admin-contact-table-wrapper">
            <table className="admin-contact-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Message</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {messages.map(msg => (
                  <tr key={msg.id}>
                    <td>{msg.id}</td>
                    <td>{msg.name}</td>
                    <td>{msg.email}</td>
                    <td>{msg.message}</td>
                    <td>{msg.created_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <AdminFooter />
    </div>
  );
};

export default Contact;
