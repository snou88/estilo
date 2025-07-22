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
  image: string;
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
    setShowEditModal(true);
  };
  const confirmDelete = () => {
    setShowDeleteModal(false);
    setSelectedProduct(null);
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
  const handleAddImages = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setAddForm(f => ({ ...f, images: files, colors: files.map(() => '') }));
  };
  const handleMainImage = (idx: number) => {
    setAddForm(f => {
      let arr = [...f.is_main];
      if (arr.includes(idx)) arr = arr.filter(i => i !== idx);
      else arr = [idx]; // Only one main image
      return { ...f, is_main: arr };
    });
  };
  const handleImageColor = (idx: number, value: string) => {
    setAddForm(f => {
      const colors = [...f.colors];
      colors[idx] = value;
      return { ...f, colors };
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
              {paginated.length === 0 ? (
                <div className="products-empty">Aucun produit trouvé.</div>
              ) : (
                <>
                  {paginated.map(prod => (
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
                      </div>
                      <div className="product-card-body">
                        <div className="product-card-name">{prod.name}</div>
                        <div className="product-card-cat">{prod.category}</div>
                        <div className="product-card-price">{prod.price.toFixed(2)} €</div>
                      </div>
                    </div>
                  ))}
                  {/* Modale d'ajout de produit */}
                  {showAddModal && (
                    <div className="product-modal-overlay">
                      <div className="product-modal">
                        <div className="product-modal-title">Ajouter un produit</div>
                        {addSuccess ? (
                          <div className="admin-login-success">Produit ajouté avec succès !</div>
                        ) : (
                        <form className="product-modal-form" onSubmit={handleAddSubmit}>
                          <input
                            type="text"
                            name="name"
                            placeholder="Nom du produit"
                            value={addForm.name}
                            onChange={handleAddInput}
                            required
                            className="product-modal-input"
                          />
                          <select
                            name="category_id"
                            value={addForm.category_id}
                            onChange={handleAddInput}
                            required
                            className="product-modal-input"
                          >
                            <option value="">Catégorie</option>
                            {categories.map(cat => (
                              <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                          </select>
                          <input
                            type="number"
                            name="price"
                            placeholder="Prix (€)"
                            value={addForm.price}
                            onChange={handleAddInput}
                            required
                            min="0"
                            step="0.01"
                            className="product-modal-input"
                          />
                          <textarea
                            name="description"
                            placeholder="Description"
                            value={addForm.description}
                            onChange={handleAddInput}
                            className="product-modal-input"
                          />
                          <input
                            type="file"
                            name="images"
                            accept="image/*"
                            multiple
                            onChange={handleAddImages}
                            className="product-modal-input"
                          />
                          {addForm.images.length > 0 && (
                            <div className="product-modal-images-preview">
                              {addForm.images.map((img, idx) => (
                                <label key={idx} className="product-modal-image-label" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                  <input
                                    type="checkbox"
                                    checked={addForm.is_main.includes(idx)}
                                    onChange={() => handleMainImage(idx)}
                                    disabled={addForm.is_main.length > 0 && !addForm.is_main.includes(idx)}
                                  />
                                  <span>Image principale</span>
                                  <img src={URL.createObjectURL(img)} alt="preview" className="product-modal-image-preview" style={{ width: 90, height: 'auto', objectFit: 'contain', borderRadius: 6, border: '1px solid #eee' }} />
                                  <input
                                    type="text"
                                    placeholder="Couleur de l'image"
                                    value={addForm.colors[idx] || ''}
                                    onChange={e => handleImageColor(idx, e.target.value)}
                                    className="product-modal-input"
                                    style={{ width: 120 }}
                                  />
                                </label>
                              ))}
                            </div>
                          )}
                          <div className="product-modal-actions">
                            <button type="submit" className="product-modal-btn" disabled={addLoading}>
                              {addLoading ? 'Ajout...' : 'Ajouter'}
                            </button>
                            <button type="button" className="product-modal-btn cancel" onClick={() => setShowAddModal(false)} disabled={addLoading}>
                              Annuler
                            </button>
                          </div>
                          {addError && <div className="admin-login-error">{addError}</div>}
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
                  {/* Modale de confirmation modification */}
                  {showEditModal && (
                    <div className="product-modal-overlay">
                      <div className="product-modal">
                        <div className="product-modal-title">Modifier ce produit ?</div>
                        <div className="product-modal-actions">
                          <button className="product-modal-btn" onClick={confirmEdit}>Confirmer</button>
                          <button className="product-modal-btn cancel" onClick={() => setShowEditModal(false)}>Annuler</button>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* Add Product Card - make the whole card clickable */}
                  <div className="product-card product-card-add" onClick={() => setShowAddModal(true)} style={{ cursor: 'pointer' }}>
                    <button className="product-add-btn" title="Ajouter un produit" type="button" tabIndex={-1} style={{ pointerEvents: 'none' }}>
                      <span className="product-add-plus">+</span>
                      <span className="product-add-txt">Ajouter</span>
                    </button>
                  </div>
                </>
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
