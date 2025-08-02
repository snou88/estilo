import React, { useEffect, useState } from 'react';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { getPhpApiUrl } from '../../utils/api';
interface Wilaya {
  id: number;
  name: string;
  shipping_price: number;
}

const PAGE_SIZE = 4;

const WilayasAdmin: React.FC = () => {
  const [wilayas, setWilayas] = useState<Wilaya[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<{ name: string; shipping_price: number }>({ name: '', shipping_price: 0 });

  // Filtres
  const [filterName, setFilterName] = useState('');
  const [filterPrice, setFilterPrice] = useState('');

  // Pagination
  const [page, setPage] = useState(1);

  // Modal ajout
  const [showAddModal, setShowAddModal] = useState(false);
  const [newWilaya, setNewWilaya] = useState({ name: '', shipping_price: '' });
  const [addError, setAddError] = useState('');

  const fetchWilayas = async () => {
    setLoading(true);
    try {
      const res = await fetch(getPhpApiUrl('api/get_wilayas.php'));
      const data = await res.json();
      setWilayas(data.wilayas);
      setError('');
    } catch (e) {
      setError('Erreur lors du chargement des wilayas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWilayas();
  }, []);

  // Filtrage
  const filteredWilayas = wilayas.filter(w =>
    w.name.toLowerCase().includes(filterName.toLowerCase()) &&
    (filterPrice === '' || w.shipping_price === Number(filterPrice))
  );

  // Pagination
  const pageCount = Math.ceil(filteredWilayas.length / PAGE_SIZE) || 1;
  const paginatedWilayas = filteredWilayas.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  useEffect(() => { if (page > pageCount) setPage(pageCount); }, [pageCount]);

  // Edition
  const handleEdit = (wilaya: Wilaya) => {
    setEditId(wilaya.id);
    setEditValue({ name: wilaya.name, shipping_price: wilaya.shipping_price });
  };
  const handleEditSave = async (id: number) => {
    try {
      const res = await fetch(getPhpApiUrl('api/update_wilaya.php'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...editValue })
      });
      if (!res.ok) throw new Error();
      setEditId(null);
      fetchWilayas();
    } catch {
      setError('Erreur lors de la modification');
    }
  };
  const handleDelete = async (id: number) => {
    if (!window.confirm('Supprimer cette wilaya ?')) return;
    try {
      const res = await fetch(getPhpApiUrl('api/delete_wilaya.php'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (!res.ok) throw new Error();
      fetchWilayas();
    } catch {
      setError('Erreur lors de la suppression');
    }
  };

  // Ajout
  const handleAdd = async () => {
    setAddError('');
    if (!newWilaya.name.trim() || isNaN(Number(newWilaya.shipping_price)) || Number(newWilaya.shipping_price) <= 0) {
      setAddError('Nom et prix valides requis');
      return;
    }
    try {
      const res = await fetch(getPhpApiUrl('api/add_wilaya.php'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newWilaya.name, shipping_price: Number(newWilaya.shipping_price) })
      });
      if (!res.ok) throw new Error();
      setShowAddModal(false);
      setNewWilaya({ name: '', shipping_price: '' });
      fetchWilayas();
    } catch {
      setAddError("Erreur lors de l'ajout");
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Gestion des Wilayas</h1>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      {/* Filtres + bouton ajouter */}
      <div className="flex flex-wrap gap-2 mb-4 items-end justify-center md:justify-start ">
        <div>
          <label className="block text-sm font-medium mb-1">Filtrer par nom</label>
          <input type="text" value={filterName} onChange={e => { setFilterName(e.target.value); setPage(1); }} className="border px-2 py-1 rounded" placeholder="Nom..." />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Filtrer par prix</label>
          <input type="number" value={filterPrice} onChange={e => { setFilterPrice(e.target.value); setPage(1); }} className="border px-2 py-1 rounded" placeholder="Prix..." />
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="w-full md:w-auto md:ml-auto bg-green-600 text-white px-4 py-2 rounded h-10 flex items-center justify-center gap-1"
        >
          <span>Ajouter</span>
        </button>
      </div>
      {/* Tableau */}
      <table className="w-full border mb-6">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Nom</th>
            <th className="p-2 border">Prix livraison</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={3} className="text-center p-4">Chargement…</td></tr>
          ) : paginatedWilayas.length === 0 ? (
            <tr><td colSpan={3} className="text-center p-4">Aucune wilaya</td></tr>
          ) : paginatedWilayas.map(w => (
            <tr key={w.id}>
              <td className="border p-2">
                {editId === w.id ? (
                  <input value={editValue.name} onChange={e => setEditValue(ev => ({ ...ev, name: e.target.value }))} className="border px-2 py-1" />
                ) : w.name}
              </td>
              <td className="border p-2">
                {editId === w.id ? (
                  <input type="number" value={editValue.shipping_price} onChange={e => setEditValue(ev => ({ ...ev, shipping_price: Number(e.target.value) }))} className="border px-2 py-1 w-24" />
                ) : w.shipping_price}
              </td>
              <td className="border p-2 flex justify-center">
                {editId === w.id ? (
                  <>
                    <button onClick={() => handleEditSave(w.id)} className="bg-green-500 text-white px-2 py-1 rounded mr-2">Enregistrer</button>
                    <button onClick={() => setEditId(null)} className="bg-gray-300 px-2 py-1 rounded">Annuler</button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEdit(w)}
                      className="bg-blue-500 text-white px-2 py-1 rounded mr-2 flex items-center gap-1"
                    >
                      <Edit size={16} className="md:hidden" /> {/* icône visible sur petit écran */}
                      <span className="hidden md:block">Modifier</span> {/* texte visible sur md+ */}
                    </button>

                    <button
                      onClick={() => handleDelete(w.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded flex items-center gap-1"
                    >
                      <Trash2 size={16} className="md:hidden" />
                      <span className="hidden md:block">Supprimer</span>
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination */}
      <div className="flex justify-between items-center mb-6">
        <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50">Précédent</button>
        <span className="text-sm">Page {page} / {pageCount}</span>
        <button disabled={page >= pageCount} onClick={() => setPage(p => p + 1)} className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50">Suivant</button>
      </div>
      {/* Modal ajout */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md relative">
            <button onClick={() => setShowAddModal(false)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700">✕</button>
            <h2 className="text-xl font-bold mb-4">Ajouter une wilaya</h2>
            {addError && <div className="mb-2 text-red-600">{addError}</div>}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Nom</label>
              <input type="text" value={newWilaya.name} onChange={e => setNewWilaya(w => ({ ...w, name: e.target.value }))} className="border px-2 py-1 rounded w-full" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Prix livraison</label>
              <input type="number" value={newWilaya.shipping_price} onChange={e => setNewWilaya(w => ({ ...w, shipping_price: e.target.value }))} className="border px-2 py-1 rounded w-full" />
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded bg-gray-200">Annuler</button>
              <button onClick={handleAdd} className="px-4 py-2 rounded bg-green-600 text-white">Ajouter</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WilayasAdmin;