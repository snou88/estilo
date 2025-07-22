import React, { useState, useEffect } from 'react';
import AdminHeader from '../../components/AdminHeader';
import AdminFooter from '../../components/AdminFooter';
import { UserPlus, Trash2, ShieldCheck, Loader2 } from 'lucide-react';

// Mock temporaire (à remplacer par fetch backend)
const MOCK_ADMINS = [
  { id: 1, name: 'Super Admin', email: 'admin@estilo.com', role: 'Super Admin', created_at: '2024-01-01' },
  { id: 2, name: 'Sarah', email: 'sarah@estilo.com', role: 'Admin', created_at: '2024-04-12' },
  { id: 3, name: 'Yassine', email: 'yassine@estilo.com', role: 'Admin', created_at: '2024-05-03' },
];

const Settings = () => {
  const [admins, setAdmins] = useState(MOCK_ADMINS);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ name: '', email: '', password: '', role: 'Admin' });
  const [addError, setAddError] = useState('');
  const [addSuccess, setAddSuccess] = useState(false);
  const [deletingId, setDeletingId] = useState<number|null>(null);

  // TODO: Remplacer par fetch backend
  // useEffect(() => { ... }, []);

  const handleAddInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAddForm(f => ({ ...f, [name]: value }));
  };
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAddError('');
    setAddSuccess(false);
    if (!addForm.name || !addForm.email || !addForm.password) {
      setAddError('Tous les champs sont obligatoires');
      return;
    }
    // Simule ajout
    setAdmins(prev => [
      ...prev,
      { id: Math.max(...prev.map(a => a.id)) + 1, name: addForm.name, email: addForm.email, role: addForm.role, created_at: new Date().toISOString().slice(0, 10) }
    ]);
    setAddSuccess(true);
    setTimeout(() => {
      setShowAddModal(false);
      setAddForm({ name: '', email: '', password: '', role: 'Admin' });
      setAddSuccess(false);
    }, 1200);
  };
  const handleDelete = (id: number) => {
    setDeletingId(id);
    setTimeout(() => {
      setAdmins(prev => prev.filter(a => a.id !== id));
      setDeletingId(null);
    }, 900);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      <AdminHeader />
      <main className="flex-1 flex flex-col items-center justify-center py-12 px-4">
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl p-8 animate-fadein">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Gestion des administrateurs</h2>
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition"
              onClick={() => setShowAddModal(true)}
            >
              <UserPlus size={20} /> Ajouter un admin
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-xl shadow overflow-hidden">
              <thead>
                <tr className="bg-gray-50 text-gray-700 text-sm">
                  <th className="py-3 px-4 font-semibold text-center">ID</th>
                  <th className="py-3 px-4 font-semibold text-center">Nom</th>
                  <th className="py-3 px-4 font-semibold text-center">Email</th>
                  <th className="py-3 px-4 font-semibold text-center">Rôle</th>
                  <th className="py-3 px-4 font-semibold text-center">Créé le</th>
                  <th className="py-3 px-4 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin, idx) => (
                  <tr key={admin.id} className="transition-all duration-300 hover:bg-blue-50 group">
                    <td className="py-3 px-4 text-center text-gray-700 font-semibold">{admin.id}</td>
                    <td className="py-3 px-4 text-center text-gray-800 font-medium flex items-center gap-2 justify-center">
                      {admin.id === 1 && <ShieldCheck size={18} className="text-blue-500" aria-label="Super Admin" />} {admin.name}
                    </td>
                    <td className="py-3 px-4 text-center text-blue-700 underline">{admin.email}</td>
                    <td className="py-3 px-4 text-center text-gray-600">{admin.role}</td>
                    <td className="py-3 px-4 text-center text-gray-500">{admin.created_at}</td>
                    <td className="py-3 px-4 text-center">
                      {admin.id !== 1 && (
                        <button
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-600 text-white text-sm font-semibold shadow hover:bg-red-700 transition focus:outline-none focus:ring-2 focus:ring-red-400"
                          onClick={() => handleDelete(admin.id)}
                          disabled={deletingId === admin.id}
                        >
                          {deletingId === admin.id ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />}
                          Supprimer
                        </button>
                      )}
                      {admin.id === 1 && (
                        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-200 text-gray-500 text-sm font-semibold cursor-not-allowed">
                          <ShieldCheck size={16} /> Protégé
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Pop-up ajout admin */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadein" onClick={() => setShowAddModal(false)}>
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4 animate-fadein" onClick={e => e.stopPropagation()}>
              <div className="text-xl font-bold mb-4 text-gray-800 text-center">Ajouter un administrateur</div>
              {addSuccess ? (
                <div className="text-green-600 text-center font-semibold mb-4">Admin ajouté avec succès !</div>
              ) : (
              <form className="space-y-5" onSubmit={handleAddSubmit}>
                <input
                  type="text"
                  name="name"
                  placeholder="Nom"
                  value={addForm.name}
                  onChange={handleAddInput}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-700 bg-gray-50"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={addForm.email}
                  onChange={handleAddInput}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-700 bg-gray-50"
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Mot de passe"
                  value={addForm.password}
                  onChange={handleAddInput}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-700 bg-gray-50"
                />
                <select
                  name="role"
                  value={addForm.role}
                  onChange={handleAddInput}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-700 bg-gray-50"
                >
                  <option value="Admin">Admin</option>
                  <option value="Super Admin">Super Admin</option>
                </select>
                <div className="flex gap-3 justify-end mt-4">
                  <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-60">
                    Ajouter
                  </button>
                  <button type="button" className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition" onClick={() => setShowAddModal(false)}>
                    Annuler
                  </button>
                </div>
                {addError && <div className="bg-red-100 text-red-700 px-4 py-2 rounded text-center text-sm font-medium animate-shake mt-2">{addError}</div>}
              </form>
              )}
            </div>
          </div>
        )}
      </main>
      <AdminFooter />
    </div>
  );
};

export default Settings;
