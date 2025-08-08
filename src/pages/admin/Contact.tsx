import React, { useEffect, useState } from 'react';
import AdminHeader from '../../components/AdminHeader';
import AdminFooter from '../../components/AdminFooter';
import { Trash, Mail, ChevronDown, ChevronUp } from 'lucide-react';
import { getAdminPhpApiUrl } from '../../utils/api';


// Type pour un message de contact
type ContactMessage = {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
  read: boolean; // Added read status
};

const Contact = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [animate, setAnimate] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [replyingTo, setReplyingTo] = useState<ContactMessage | null>(null);
  const [sendingReply, setSendingReply] = useState(false);
  const [replySuccess, setReplySuccess] = useState('');
  const [replyError, setReplyError] = useState('');

  useEffect(() => {
    setAnimate(true);
    const fetchMessages = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('admin_token');

        const response = await fetch(getAdminPhpApiUrl('admin/get_all_contact_messages.php'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token || ''
          },
          body: JSON.stringify({
            token: token || ''
          })
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
    return () => setAnimate(false);
  }, []);

  // Handler suppression
  const handleDelete = (msg: ContactMessage) => {
    setSelectedMessage(msg);
    setShowDeleteModal(true);
  };
  const confirmDelete = async () => {
    if (!selectedMessage) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(getAdminPhpApiUrl('admin/delete_contact_message.php'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token || ''
        },
        body: JSON.stringify({ id: selectedMessage.id })
      });
      const data = await response.json();
      if (data.success) {
        setMessages(messages.filter(m => m.id !== selectedMessage.id));
        setShowDeleteModal(false);
        setSelectedMessage(null);
      } else {
        setError(data.error || 'Erreur lors de la suppression');
      }
    } catch (e) {
      setError('Erreur réseau ou serveur');
    }
    setLoading(false);
  };

  // Handler marquer comme lu (exemple, à adapter selon backend)
  const handleMarkRead = (msg: ContactMessage) => {
    // TODO: Appel API pour marquer comme lu
    // Ici, on simule juste un effet visuel
    setMessages(messages.map(m => m.id === msg.id ? { ...m, read: true } : m));
  };

  // Handler ouvrir modale réponse
  const handleReply = (msg: ContactMessage) => {
    setReplyingTo(msg);
    setReplyContent('');
    setReplySuccess('');
    setReplyError('');
    setShowReplyModal(true);
  };
  const handleSendReply = async () => {
    setSendingReply(true);
    setReplySuccess('');
    setReplyError('');
    try {
      // TODO: Appel API pour envoyer la réponse (à implémenter côté backend)
      // Simule succès
      setTimeout(() => {
        setReplySuccess('Réponse envoyée avec succès !');
        setSendingReply(false);
        setTimeout(() => {
          setShowReplyModal(false);
        }, 1200);
      }, 900);
    } catch (e) {
      setReplyError('Erreur lors de l’envoi de la réponse.');
      setSendingReply(false);
    }
  };

  const [expandedId, setExpandedId] = useState<number | null>(null);


  const toggleExpand = (id: number) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 flex flex-col">
        <AdminHeader />

        <main className="flex-1 p-6 md:p-20">
          <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">
            Gestion des contacts
          </h2>

          {loading ? (
            <div className="flex justify-center items-center h-40 text-lg text-gray-500 animate-pulse">
              Chargement...
            </div>
          ) : error ? (
            <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-4 shadow">
              {error}
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              Aucun message de contact trouvé.
            </div>
          ) : (
            <>
              {/* Desktop/Table */}
              <div className="hidden md:block overflow-x-auto w-full max-w-6xl mx-auto">
                <table
                  className={`w-full bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-500 ${animate ? 'animate-fadein' : ''
                    }`}
                >
                  <thead>
                    <tr className="bg-gray-50 text-gray-700 text-sm">
                      <th className="py-3 px-4 font-semibold text-center min-w-[120px]">Nom</th>
                      <th className="py-3 px-4 font-semibold text-center min-w-[180px]">Email</th>
                      <th className="py-3 px-4 font-semibold text-left min-w-[220px]">Message</th>
                      <th className="py-3 px-4 font-semibold text-center min-w-[140px]">Date</th>
                      <th className="py-3 px-4 font-semibold text-center min-w-[140px]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {messages.map((msg, idx) => (
                      <tr
                        key={msg.id}
                        className={`transition-all duration-300 hover:bg-blue-50 group ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                        style={{ animationDelay: `${idx * 60}ms` }}
                      >
                        <td className="py-3 px-4 text-center text-gray-800 font-medium align-middle">{msg.name}</td>
                        <td className="py-3 px-4 text-center text-blue-700 underline align-middle">{msg.email}</td>
                        <td className="py-3 px-4 text-left max-w-xs text-gray-600 break-words align-middle">{msg.message}</td>
                        <td className="py-3 px-4 text-center text-gray-500 whitespace-nowrap align-middle">{msg.created_at}</td>
                        <td className="py-3 px-4 flex gap-2 items-center justify-center align-middle">
                          <button
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-sm font-semibold shadow hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
                            title="Répondre"
                            onClick={() => handleReply(msg)}
                          >
                            <Mail size={18} /> Répondre
                          </button>
                          <button
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-600 text-white text-sm font-semibold shadow hover:bg-red-700 transition focus:outline-none focus:ring-2 focus:ring-red-400"
                            title="Supprimer"
                            onClick={() => handleDelete(msg)}
                          >
                            <Trash size={18} /> Supprimer
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile/List */}
              <ul className="block md:hidden space-y-4">
                {messages.map(msg => {
                  const isOpen = expandedId === msg.id;
                  return (
                    <li
                      key={msg.id}
                      className="bg-white rounded-xl shadow p-4 transition"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-800">{msg.name}</p>
                          <p className="text-blue-600 underline text-sm">
                            {msg.email}
                          </p>
                        </div>
                        <button
                          onClick={() => toggleExpand(msg.id)}
                          className="p-2 rounded-full hover:bg-gray-100 transition"
                          aria-label="Toggle details"
                        >
                          {isOpen ? (
                            <ChevronUp size={20} />
                          ) : (
                            <ChevronDown size={20} />
                          )}
                        </button>
                      </div>

                      {isOpen && (
                        <div className="mt-4 space-y-3 border-t pt-3">
                          <p className="text-gray-500 text-sm">
                            <span className="font-semibold">Date :</span>{' '}
                            {msg.created_at}
                          </p>
                          <p className="text-gray-700">{msg.message}</p>

                          <div className="flex gap-2 flex-wrap">
                            <button
                              onClick={() => handleReply(msg)}
                              className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-sm font-semibold shadow hover:bg-blue-700 transition"
                            >
                              <Mail size={16} />
                              Répondre
                            </button>

                            <button
                              onClick={() => handleDelete(msg)}
                              className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-red-600 text-white text-sm font-semibold shadow hover:bg-red-700 transition"
                            >
                              <Trash size={16} />
                              Supprimer
                            </button>
                          </div>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </main>

        <AdminFooter />
      </div>
    </div>
  );
};

export default Contact;
