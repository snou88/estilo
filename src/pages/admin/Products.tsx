import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import AdminHeader from '../../components/AdminHeader';
import AdminFooter from '../../components/AdminFooter';
import './AdminSection.css';
import './ProductsAdmin.css';
import model from '../../assets/images/products/model.png';
import { Edit, Trash } from 'lucide-react';

const ITEMS_PER_PAGE = 6;

// Type for product
interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string; // chemin de l'image principale (product_images)
  color?: string; // couleur de l'image principale
}

const STATIC_MODEL: Product = {
  id: 1,
  name: 'T-shirt Estilo',
  category: 'Vêtements',
  price: 19.99,
  image: model
};

const Products = () => {
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const [animate, setAnimate] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
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

  // Pop-up de modification produit
  const [editForm, setEditForm] = useState({
    name: '',
    category_id: '',
    price: '',
    description: '',
    image: null as File | null,
    imagePreview: '',
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState(false);

  // Ajout : gestion multi-images, couleur, suppression, image principale
  const [editImages, setEditImages] = useState<any[]>([]); // {id, image_path, color, is_main, toDelete}
  const [editNewImages, setEditNewImages] = useState<File[]>([]);
  const [editNewColors, setEditNewColors] = useState<string[]>([]);
  const [editNewIsMain, setEditNewIsMain] = useState<number[]>([]);

  useEffect(() => {
    setAnimate(true);
    return () => setAnimate(false);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('admin_token');
        const response = await fetch('http://localhost/estilo/admin/get_all_products.php', {
          headers: {
            'Authorization': token || ''
          }
        });
        const data = await response.json();
        if (response.ok) {
          // Always include the static model as the first product
          const fetched: Product[] = data.products.map((p: any) => ({
            id: p.id,
            name: p.name,
            category: p.category,
            price: parseFloat(p.price),
            image: p.image ? p.image : model
          }));
          // Remove any duplicate with id 1 (static model)
          const filteredFetched = fetched;//.filter(p => p.id !== 1);
          setProducts(filteredFetched)//STATIC_MODEL, ...filteredFetched]);
        } else {
          setError(data.error || 'Erreur lors du chargement des produits');
        }
      } catch (err) {
        setError('Erreur réseau ou serveur');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Fetch categories for the select
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        const response = await fetch('http://localhost/estilo/admin/get_all_categories.php', {
          headers: { 'Authorization': token || '' }
        });
        const data = await response.json();
        if (response.ok) setCategories(data.categories || []);
      } catch {}
    };
    fetchCategories();
  }, []);

  // Actions modale
  const handleDelete = (prod: Product) => {
    setSelectedProduct(prod);
    setShowDeleteModal(true);
  };
  const handleEdit = (prod: Product) => {
    setSelectedProduct(prod);
    // Charger les images existantes du produit (à partir du backend si besoin)
    fetch(`http://localhost/estilo/admin/get_product_images.php?id=${prod.id}`, {
      headers: { 'Authorization': localStorage.getItem('admin_token') || '' }
    })
      .then(res => res.json())
      .then(data => {
        setEditImages(data.images.map((img: any) => ({ ...img, toDelete: false })));
        setEditNewImages([]);
        setEditNewColors([]);
        setEditNewIsMain([]);
        setEditForm({
          name: prod.name,
          category_id: categories.find(c => c.name === prod.category)?.id?.toString() || '',
          price: prod.price.toString(),
          description: '',
          image: null,
          imagePreview: prod.image,
        });
        setShowEditModal(true);
      });
  };
  // Suppression produit
  const confirmDelete = async () => {
    if (!selectedProduct) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('http://localhost/estilo/admin/delete_product.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token || ''
        },
        body: JSON.stringify({ id: selectedProduct.id })
      });
      const data = await response.json();
      if (data.success) {
        setProducts(products.filter(p => p.id !== selectedProduct.id));
        setShowDeleteModal(false);
        setSelectedProduct(null);
      } else {
        setError(data.error || 'Erreur lors de la suppression');
      }
    } catch (e) {
      setError('Erreur réseau ou serveur');
    }
    setLoading(false);
  };
  const confirmEdit = () => {
    setShowEditModal(false);
    setSelectedProduct(null);
  };

  // Add product handlers
  const handleAddInput = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAddForm(f => ({ ...f, [name]: value }));
  };
  // Ajout : gestion multi-images, couleur, suppression, image principale
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
      const response = await fetch('http://localhost/estilo/admin/add_product.php', {
        method: 'POST',
        headers: { 'Authorization': token || '' },
        body: formData
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setAddSuccess(true);
      } else {
        setAddError(data.error || 'Erreur lors de l\'ajout du produit');
      }
    } catch {
      setAddError('Erreur réseau ou serveur');
    } finally {
      setAddLoading(false);
    }
  };

  // Filtrage
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(filter.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handlePage = (n: number) => {
    setAnimate(false);
    setTimeout(() => {
      setPage(n);
      setAnimate(true);
    }, 120);
  };

  // Helper to get the correct image URL
  const getProductImageUrl = (img: string) => {
    if (!img) return model;
    if (img.startsWith('/uploads/products/')) {
      return `http://localhost/estilo/public${img}`;
    }
    return img;
  };

  // Modification : gestion multi-images, couleur, suppression, image principale
  const handleEditInput = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditForm(f => ({ ...f, [name]: value }));
  };
  const handleEditImage = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setEditForm(f => ({ ...f, image: file, imagePreview: URL.createObjectURL(file) }));
    }
  };
  const handleEditSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    setEditLoading(true);
    setEditError('');
    setEditSuccess(false);
    try {
      const formData = new FormData();
      formData.append('id', selectedProduct.id.toString());
      formData.append('name', editForm.name);
      formData.append('category_id', editForm.category_id);
      formData.append('price', editForm.price);
      formData.append('description', editForm.description);
      if (editForm.image) {
        formData.append('image', editForm.image);
      }
      const token = localStorage.getItem('admin_token');
      const response = await fetch('http://localhost/estilo/admin/edit_product.php', {
        method: 'POST',
        headers: { 'Authorization': token || '' },
        body: formData
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setEditSuccess(true);
        // Mettre à jour le produit dans le state
        setProducts(products.map(p =>
          p.id === selectedProduct.id
            ? { ...p, name: editForm.name, category: categories.find(c => c.id.toString() === editForm.category_id)?.name || '', price: parseFloat(editForm.price), image: editForm.image ? editForm.imagePreview : p.image }
            : p
        ));
        setTimeout(() => {
          setShowEditModal(false);
          setSelectedProduct(null);
        }, 1200);
      } else {
        setEditError(data.error || 'Erreur lors de la modification');
      }
    } catch {
      setEditError('Erreur réseau ou serveur');
    } finally {
      setEditLoading(false);
    }
  };
  const handleEditImageColor = (idx: number, value: string) => {
    setEditImages(imgs => imgs.map((img, i) => i === idx ? { ...img, color: value } : img));
  };
  const handleEditImageDelete = (idx: number) => {
    setEditImages(imgs => imgs.map((img, i) => i === idx ? { ...img, toDelete: !img.toDelete } : img));
  };
  const handleEditImageMain = (idx: number) => {
    setEditImages(imgs => imgs.map((img, i) => ({ ...img, is_main: i === idx ? 1 : 0 })));
    setEditNewIsMain([]); // reset new images main
  };
  const handleEditAddImages = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setEditNewImages(arr => [...arr, ...files]);
    setEditNewColors(arr => [...arr, ...files.map(() => '#cccccc')]);
  };
  const handleEditRemoveNewImage = (idx: number) => {
    setEditNewImages(arr => arr.filter((_, i) => i !== idx));
    setEditNewColors(arr => arr.filter((_, i) => i !== idx));
    setEditNewIsMain(arr => arr.filter(i => i !== idx));
  };
  const handleEditNewImageColor = (idx: number, value: string) => {
    setEditNewColors(arr => arr.map((c, i) => i === idx ? value : c));
  };
  const handleEditNewImageMain = (idx: number) => {
    setEditImages(imgs => imgs.map(img => ({ ...img, is_main: 0 })));
    setEditNewIsMain([idx]);
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader />
        <main className={`admin-content products-fadein${animate ? ' show' : ''}`}>
          <h2 className="admin-dashboard-title">Gestion des produits</h2>
          <div className="products-filter-bar">
            <input
              type="text"
              placeholder="Filtrer par nom..."
              value={filter}
              onChange={e => { setPage(1); setFilter(e.target.value); }}
              className="products-filter-input"
            />
          </div>
          {loading ? (
            <div>Chargement...</div>
          ) : error ? (
            <div className="admin-login-error">{error}</div>
          ) : (
            <div className="products-cards-grid">
              {/* Carte d'ajout toujours en premier */}
              <div className="product-card product-card-add" onClick={() => setShowAddModal(true)} style={{ cursor: 'pointer' }}>
                <button className="product-add-btn" title="Ajouter un produit" type="button" tabIndex={-1} style={{ pointerEvents: 'none' }}>
                  <span className="product-add-plus">+</span>
                  <span className="product-add-txt">Ajouter</span>
                </button>
              </div>
              {/* Affichage des produits */}
              {paginated.length === 0 ? (
                <div className="products-empty">Aucun produit trouvé.</div>
              ) : (
                paginated.map(prod => (
                  <div className="product-card" key={prod.id}>
                    <div className="product-card-actions">
                      <button
                        className="product-card-action-btn"
                        title="Modifier"
                        onClick={() => handleEdit(prod)}
                      >
                        <Edit size={18} color="#2563eb" />
                      </button>
                      <button
                        className="product-card-action-btn"
                        title="Supprimer"
                        onClick={() => handleDelete(prod)}
                      >
                        <Trash size={18} color="#e11d48" />
                      </button>
                    </div>
                    <div className="product-card-img">
                      <img src={getProductImageUrl(prod.image)} alt={prod.name} onError={e => (e.currentTarget.src = '/mock/noimg.jpg')} />
                      {prod.color && (
                        <div className="flex items-center justify-center mt-2">
                          <span className="w-5 h-5 rounded-full border border-gray-300" style={{ background: prod.color }} title={prod.color}></span>
                        </div>
                      )}
                    </div>
                    <div className="product-card-body">
                      <div className="product-card-name">{prod.name}</div>
                      <div className="product-card-cat">{prod.category}</div>
                      <div className="product-card-price">{prod.price.toFixed(2)} DA</div>
                    </div>
                  </div>
                ))
              )}
              {/* Pop-up d'ajout refondu avec Tailwind */}
              {showAddModal && (
                <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadein" onClick={() => setShowAddModal(false)}>
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
                          {/* Carte d'ajout toujours visible */}
                          <label className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg w-36 h-36 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50">
                            <span className="text-3xl text-blue-400">+</span>
                            <span className="text-xs text-gray-500">Ajouter une image</span>
                            <input type="file" accept="image/*" multiple className="hidden" onChange={handleAddImages} />
                          </label>
                        </div>
                      )}
                      <div className="flex gap-3 justify-end mt-4">
                        <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-60" disabled={addLoading}>
                          {addLoading ? 'Ajout...' : 'Ajouter'}
                        </button>
                        <button type="button" className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition" onClick={() => setShowAddModal(false)} disabled={addLoading}>
                          Annuler
                        </button>
                      </div>
                      {addError && <div className="bg-red-100 text-red-700 px-4 py-2 rounded text-center text-sm font-medium animate-shake mt-2">{addError}</div>}
                    </form>
                    )}
                  </div>
                </div>
              )}
                  {/* Modale de confirmation suppression */}
                  {showDeleteModal && (
                    <div className="product-modal-overlay">
                      <div className="product-modal">
                        <div className="product-modal-title">Supprimer ce produit ?</div>
                        <div className="product-modal-actions">
                          <button className="product-modal-btn" onClick={confirmDelete}>Confirmer</button>
                          <button className="product-modal-btn cancel" onClick={() => setShowDeleteModal(false)}>Annuler</button>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* Pop-up de modification produit */}
                  {showEditModal && selectedProduct && (
                    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadein" onClick={() => setShowEditModal(false)}>
                      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg mx-4 animate-fadein" onClick={e => e.stopPropagation()}>
                        <div className="text-xl font-bold mb-4 text-gray-800 text-center">Modifier le produit</div>
                        {editSuccess ? (
                          <div className="text-green-600 text-center font-semibold mb-4">Produit modifié avec succès !</div>
                        ) : (
                        <form className="space-y-5" onSubmit={handleEditSubmit}>
                          <input
                            type="text"
                            name="name"
                            placeholder="Nom du produit"
                            value={editForm.name}
                            onChange={handleEditInput}
                            required
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-700 bg-gray-50"
                          />
                          <select
                            name="category_id"
                            value={editForm.category_id}
                            onChange={handleEditInput}
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
                            value={editForm.price}
                            onChange={handleEditInput}
                            required
                            min="0"
                            step="0.01"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-700 bg-gray-50"
                          />
                          <textarea
                            name="description"
                            placeholder="Description"
                            value={editForm.description}
                            onChange={handleEditInput}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-700 bg-gray-50"
                          />
                          <div className="flex flex-col gap-2">
                            <label className="block text-gray-600 text-sm mb-1">Image principale</label>
                            {editForm.imagePreview && (
                              <img src={editForm.imagePreview} alt="Aperçu" className="w-24 h-auto object-contain rounded border border-gray-200 mb-2" />
                            )}
                            <input
                              type="file"
                              name="image"
                              accept="image/*"
                              onChange={handleEditImage}
                              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-700 bg-gray-50"
                            />
                          </div>
                          {(editImages.length > 0 || editNewImages.length > 0) && (
                            <div className="flex flex-wrap gap-4 mt-2">
                              {editImages.map((img, idx) => (
                                <div key={img.id} className={`bg-white rounded-lg shadow p-3 flex flex-col items-center relative w-36 ${img.toDelete ? 'opacity-40' : ''}`}> 
                                  <button type="button" className="absolute top-1 right-1 text-red-500" onClick={() => handleEditImageDelete(idx)} title="Supprimer">
                                    {img.toDelete ? '↺' : '×'}
                                  </button>
                                  <img src={`http://localhost/estilo/public${img.image_path}`} alt="img" className="w-24 h-24 object-contain rounded border border-gray-200 mb-2" />
                                  <label className="text-xs text-gray-500 mb-1">Couleur</label>
                                  <input type="color" value={img.color || '#cccccc'} onChange={e => handleEditImageColor(idx, e.target.value)} className="w-8 h-8 mb-1" />
                                  <label className="flex items-center gap-1 text-xs">
                                    <input type="radio" checked={!!img.is_main} onChange={() => handleEditImageMain(idx)} disabled={img.toDelete} />
                                    Image principale
                                  </label>
                                </div>
                              ))}
                              {editNewImages.map((img, idx) => (
                                <div key={idx} className="bg-white rounded-lg shadow p-3 flex flex-col items-center relative w-36">
                                  <button type="button" className="absolute top-1 right-1 text-red-500" onClick={() => handleEditRemoveNewImage(idx)} title="Supprimer">
                                    ×
                                  </button>
                                  <img src={URL.createObjectURL(img)} alt="preview" className="w-24 h-24 object-contain rounded border border-gray-200 mb-2" />
                                  <label className="text-xs text-gray-500 mb-1">Couleur</label>
                                  <input type="color" value={editNewColors[idx] || '#cccccc'} onChange={e => handleEditNewImageColor(idx, e.target.value)} className="w-8 h-8 mb-1" />
                                  <label className="flex items-center gap-1 text-xs">
                                    <input type="radio" checked={editNewIsMain.includes(idx)} onChange={() => handleEditNewImageMain(idx)} />
                                    Image principale
                                  </label>
                                </div>
                              ))}
                              {/* Carte d'ajout toujours visible */}
                              <label className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg w-36 h-36 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50">
                                <span className="text-3xl text-blue-400">+</span>
                                <span className="text-xs text-gray-500">Ajouter une image</span>
                                <input type="file" accept="image/*" multiple className="hidden" onChange={handleEditAddImages} />
                              </label>
                            </div>
                          )}
                          <div className="flex gap-3 justify-end mt-4">
                            <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-60" disabled={editLoading}>
                              {editLoading ? 'Enregistrement...' : 'Enregistrer'}
                            </button>
                            <button type="button" className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition" onClick={() => setShowEditModal(false)} disabled={editLoading}>
                              Annuler
                            </button>
                          </div>
                          {editError && <div className="bg-red-100 text-red-700 px-4 py-2 rounded text-center text-sm font-medium animate-shake mt-2">{editError}</div>}
                        </form>
                        )}
                      </div>
                    </div>
                  )}
            </div>
          )}
          <div className="products-pagination justify-center">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                className={`products-page-btn${page === i + 1 ? ' active' : ''}`}
                onClick={() => handlePage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </main>
        <AdminFooter />
      </div>
    </div>
  );
};

export default Products;
