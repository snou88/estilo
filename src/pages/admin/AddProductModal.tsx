import React, { useState, ChangeEvent, FormEvent } from 'react';
import { getPhpApiUrl } from '../../utils/api';

interface Category {
  id: number;
  name: string;
}

interface AddProductModalProps {
  open: boolean;
  onClose: () => void;
  categories: Category[];
  onSuccess?: () => void;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ open, onClose, categories, onSuccess }) => {
  const [addForm, setAddForm] = useState({
    name: '',
    category_id: '',
    price: '',
    description: '',
    images: [] as File[],
    is_main: [] as number[],
    colors: [] as string[],
  });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState('');
  const [addSuccess, setAddSuccess] = useState(false);

  const handleAddInput = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAddForm(f => ({ ...f, [name]: value }));
  };
  const handleAddImages = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setAddForm(f => ({
      ...f,
      images: [...f.images, ...files],
      colors: [...f.colors, ...files.map(() => '#cccccc')],
    }));
  };
  const handleRemoveAddImage = (idx: number) => {
    setAddForm(f => ({
      ...f,
      images: f.images.filter((_, i) => i !== idx),
      colors: f.colors.filter((_, i) => i !== idx),
      is_main: f.is_main.filter(i => i !== idx),
    }));
  };
  const handleAddImageColor = (idx: number, value: string) => {
    setAddForm(f => {
      const colors = [...f.colors];
      colors[idx] = value;
      return { ...f, colors };
    });
  };
  const handleMainImage = (idx: number) => {
    setAddForm(f => {
      let arr = [...f.is_main];
      if (arr.includes(idx)) arr = arr.filter(i => i !== idx);
      else arr = [idx]; // Only one main image
      return { ...f, is_main: arr };
    });
  };
  const handleAddSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setAddLoading(true);
    setAddError('');
    setAddSuccess(false);
    try {
      const formData = new FormData();
      formData.append('name', addForm.name);
      formData.append('category_id', addForm.category_id);
      formData.append('price', addForm.price);
      formData.append('description', addForm.description);
      addForm.images.forEach((file, i) => {
        formData.append('images[]', file);
        if (addForm.is_main.includes(i)) {
          formData.append('is_main[]', String(i));
        }
        formData.append('colors[]', addForm.colors[i] || '');
      });
      const token = localStorage.getItem('admin_token');
      const response = await fetch(getPhpApiUrl('admin/add_product.php'), {
        method: 'POST',
        headers: { 'Authorization': token || '' },
        body: formData
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setAddSuccess(true);
        if (onSuccess) onSuccess();
      } else {
        setAddError(data.error || 'Erreur lors de l\'ajout du produit');
      }
    } catch {
      setAddError('Erreur réseau ou serveur');
    } finally {
      setAddLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadein" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg mx-4 animate-fadein" onClick={e => e.stopPropagation()}>
        <div className="text-xl font-bold mb-4 text-gray-800 text-center">Ajouter un produit</div>
        {addSuccess ? (
          <div className="text-green-600 text-center font-semibold mb-4">Produit ajouté avec succès !</div>
        ) : (
          <form className="space-y-5" onSubmit={handleAddSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Nom du produit"
              value={addForm.name}
              onChange={handleAddInput}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-700 bg-gray-50"
            />
            <select
              name="category_id"
              value={addForm.category_id}
              onChange={handleAddInput}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-700 bg-gray-50"
            >
              <option value="">Catégorie</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <input
              type="number"
              name="price"
              placeholder="Prix (DA)"
              value={addForm.price}
              onChange={handleAddInput}
              required
              min="0"
              step="0.01"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-700 bg-gray-50"
            />
            <textarea
              name="description"
              placeholder="Description"
              value={addForm.description}
              onChange={handleAddInput}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-700 bg-gray-50"
            />
            {/* Carte d'ajout toujours visible */}
            <label className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg w-36 h-36 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50">
              <span className="text-3xl text-blue-400">+</span>
              <span className="text-xs text-gray-500">Ajouter une image</span>
              <input type="file" accept="image/*" multiple className="hidden" onChange={handleAddImages} />
            </label>
            {addForm.images.length > 0 && (
              <div className="flex flex-wrap gap-4 mt-2">
                {addForm.images.map((img, idx) => (
                  <div key={idx} className="bg-white rounded-lg shadow p-3 flex flex-col items-center relative w-36">
                    <button type="button" className="absolute top-1 right-1 text-red-500" onClick={() => handleRemoveAddImage(idx)} title="Supprimer">
                      ×
                    </button>
                    <img src={URL.createObjectURL(img)} alt="preview" className="w-24 h-24 object-contain rounded border border-gray-200 mb-2" />
                    <label className="text-xs text-gray-500 mb-1">Couleur</label>
                    <input type="color" value={addForm.colors[idx] || '#cccccc'} onChange={e => handleAddImageColor(idx, e.target.value)} className="w-8 h-8 mb-1" />
                    <label className="flex items-center gap-1 text-xs">
                      <input type="checkbox" checked={addForm.is_main.includes(idx)} onChange={() => handleMainImage(idx)} disabled={addForm.is_main.length > 0 && !addForm.is_main.includes(idx)} />
                      Image principale
                    </label>
                  </div>
                ))}

              </div>
            )}
            <div className="flex gap-3 justify-end mt-4">
              <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-60" disabled={addLoading}>
                {addLoading ? 'Ajout...' : 'Ajouter'}
              </button>
              <button type="button" className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition" onClick={onClose} disabled={addLoading}>
                Annuler
              </button>
            </div>
            {addError && <div className="bg-red-100 text-red-700 px-4 py-2 rounded text-center text-sm font-medium animate-shake mt-2">{addError}</div>}
          </form>
        )}
      </div>
    </div>
  );
};

export default AddProductModal; 