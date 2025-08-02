import React, { useState, useEffect } from 'react';
import { UserPlus, Trash2, ShieldCheck, Loader2, ChevronDown, ChevronUp  } from 'lucide-react';
import AdminHeader from '../../components/AdminHeader';
import AdminFooter from '../../components/AdminFooter';
import './AdminSection.css';
import { getPhpApiUrl } from '../../utils/api';





interface Admin {
  id: number;
  full_name: string;
  email: string;
  created_at: string;
  is_main_admin?: boolean;
}

const Settings = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const toggleExpand = (id: number) => setExpandedId(prev => (prev === id ? null : id));
  const [addForm, setAddForm] = useState({ 
    full_name: '', 
    email: '', 
    password: ''
  });
  const [addError, setAddError] = useState('');
  const [addSuccess, setAddSuccess] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState('');

  // Fetch admins from backend
  const fetchAdmins = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(getPhpApiUrl('admin/get_all_admins.php'), {
        headers: {
          'Authorization': token || ''
        }
      });
      
      if (!response.ok) {
        throw new Error('Erreur réseau lors de la récupération des administrateurs');
      }
      
      const data = await response.json();
      
      if (data.success && Array.isArray(data.data.admins)) {
        setAdmins(data.data.admins);
      } else {
        throw new Error(data.error || 'Format de réponse inattendu du serveur');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(`Erreur lors du chargement des administrateurs: ${errorMessage}`);
      console.error('Error fetching admins:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleAddInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError('');
    setAddSuccess(false);
    
    if (!addForm.full_name || !addForm.email || !addForm.password) {
      setAddError('Tous les champs sont obligatoires');
      return;
    }

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(getPhpApiUrl('admin/add_admin.php'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token || ''
        },
        body: JSON.stringify(addForm)
      });
      
      const data = await response.json();
      
      if (data.success) {
        setAddSuccess(true);
        setAddForm({ full_name: '', email: '', password: '' });
        await fetchAdmins(); // Refresh the list
        
        setTimeout(() => {
          setShowAddModal(false);
          setAddSuccess(false);
        }, 1500);
      } else {
        throw new Error(data.error || 'Erreur lors de l\'ajout de l\'administrateur');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setAddError(errorMessage);
      console.error('Error adding admin:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet administrateur ?')) {
      return;
    }
    
    setDeletingId(id);
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(getPhpApiUrl('admin/delete_admin.php'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token || ''
        },
        body: JSON.stringify({ id })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setAdmins(prev => prev.filter(admin => admin.id !== id));
      } else {
        throw new Error(data.error || 'Erreur lors de la suppression');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      alert(`Erreur lors de la suppression: ${errorMessage}`);
      console.error('Error deleting admin:', err);
      await fetchAdmins(); // Refresh the list in case of error
    } finally {
      setDeletingId(null);
    }
  };

  // Format date to display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  

  return (
      <div className="admin-container">
        <div className="admin-content flex flex-col min-h-screen">
          <AdminHeader />
  
          <main className="flex-1 flex flex-col p-4 md:p-8">
            <div className="w-full bg-white rounded-2xl shadow-2xl p-4 md:p-8 animate-fadein space-y-6">
              {/* Header + Add button */}
              <div className="grid gap-5 md:flex items-center justify-between">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                  Gestion des administrateurs
                </h2>
                <button
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition text-sm md:text-base"
                  onClick={() => setShowAddModal(true)}
                >
                  <UserPlus size={20} /> Ajouter un admin
                </button>
              </div>
  
              {error && (
                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}
  
              {/* DESKTOP TABLE */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full bg-white rounded-xl shadow overflow-hidden">
                  <thead>
                    <tr className="bg-gray-50 text-gray-700 text-sm">
                      <th className="py-3 px-4 font-semibold text-center">ID</th>
                      <th className="py-3 px-4 font-semibold text-center">Nom</th>
                      <th className="py-3 px-4 font-semibold text-center">Email</th>
                      <th className="py-3 px-4 font-semibold text-center">Créé le</th>
                      <th className="py-3 px-4 font-semibold text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center">
                          <Loader2 className="animate-spin h-8 w-8 text-blue-500 mx-auto" />
                        </td>
                      </tr>
                    ) : admins.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-gray-500">
                          Aucun administrateur trouvé
                        </td>
                      </tr>
                    ) : (
                      admins.map(admin => (
                        <tr
                          key={admin.id}
                          className="transition-all duration-300 hover:bg-blue-50"
                        >
                          <td className="py-3 px-4 text-center font-semibold text-gray-700">
                            {admin.id}
                          </td>
                          <td className="py-3 px-4 text-center flex items-center justify-center gap-2">
                            {admin.is_main_admin && (
                              <ShieldCheck
                                size={18}
                                className="text-blue-500"
                                aria-label="Principal"
                              />
                            )}
                            <span className="font-medium text-gray-800">
                              {admin.full_name}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center text-blue-700">
                            {admin.email}
                          </td>
                          <td className="py-3 px-4 text-center text-gray-500">
                            {formatDate(admin.created_at)}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {!admin.is_main_admin && (
                              <button
                                onClick={() => handleDelete(admin.id)}
                                disabled={deletingId === admin.id}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-600 text-white text-sm font-semibold shadow hover:bg-red-700 transition"
                              >
                                {deletingId === admin.id ? (
                                  <Loader2 className="animate-spin" size={16} />
                                ) : (
                                  <Trash2 size={16} />
                                )}
                                <span className="hidden sm:inline">Supprimer</span>
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
  
              {/* MOBILE LIST */}
              <ul className="block md:hidden space-y-4">
                {loading ? (
                  <li className="py-8 text-center">
                    <Loader2 className="animate-spin h-8 w-8 text-blue-500 mx-auto" />
                  </li>
                ) : admins.length === 0 ? (
                  <li className="py-8 text-center text-gray-500">
                    Aucun administrateur trouvé
                  </li>
                ) : (
                  admins.map(admin => {
                    const open = expandedId === admin.id;
                    return (
                      <li
                        key={admin.id}
                        className="bg-white rounded-xl shadow p-4 transition"
                      >
                        <div className=" flex items-center justify-between">
                          <div className="space-y-0.5">
                            <p className="text-gray-800 font-semibold">
                              {admin.full_name}{' '}
                              {admin.is_main_admin && (
                                <ShieldCheck
                                  size={16}
                                  className="inline text-blue-500"
                                  aria-label="Principal"
                                />
                              )}
                            </p>
                            <p className="text-blue-600 text-sm underline">
                              {admin.email}
                            </p>
                          </div>
                          <button
                            onClick={() => toggleExpand(admin.id)}
                            className="p-2 rounded-full hover:bg-gray-100 transition"
                            aria-label="Toggle details"
                          >
                            {open ? <ChevronUp /> : <ChevronDown />}
                          </button>
                        </div>
  
                        {open && (
                          <div className="mt-4 space-y-2 border-t pt-3">
                            <p className="text-gray-500 text-sm">
                              <span className="font-semibold">ID :</span> {admin.id}
                            </p>
                            <p className="text-gray-500 text-sm">
                              <span className="font-semibold">Créé le :</span>{' '}
                              {formatDate(admin.created_at)}
                            </p>
                            {!admin.is_main_admin && (
                              <button
                                onClick={() => handleDelete(admin.id)}
                                disabled={deletingId === admin.id}
                                className="w-full inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-red-600 text-white text-sm font-semibold shadow hover:bg-red-700 transition"
                              >
                                {deletingId === admin.id ? (
                                  <Loader2 className="animate-spin" size={16} />
                                ) : (
                                  <Trash2 size={16} />
                                )}
                                Supprimer
                              </button>
                            )}
                          </div>
                        )}
                      </li>
                    );
                  })
                )}
              </ul>
            </div>
          </main>
  
          <AdminFooter />
        </div>

      {/* Add Admin Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-scale-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Ajouter un administrateur</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            
            {addError && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {addError}
              </div>
            )}
            
            {addSuccess ? (
              <div className="p-6 text-center">
                <div className="text-green-500 text-4xl mb-4">✓</div>
                <p className="text-lg font-medium text-gray-800">Administrateur ajouté avec succès !</p>
              </div>
            ) : (
              <form onSubmit={handleAddSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom d'utilisateur</label>
                  <input
                    type="text"
                    name="full_name"
                    value={addForm.full_name}
                    onChange={handleAddInput}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nom d'utilisateur"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={addForm.email}
                    onChange={handleAddInput}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="email@exemple.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
                  <input
                    type="password"
                    name="password"
                    value={addForm.password}
                    onChange={handleAddInput}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="••••••••"
                  />
                </div>
                
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                    disabled={!addForm.full_name || !addForm.email || !addForm.password}
                  >
                    {addSuccess ? (
                      <>
                        <Loader2 className="animate-spin" size={18} />
                        Ajout en cours...
                      </>
                    ) : 'Ajouter'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
