import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import AdminHeader from '../../components/AdminHeader';
import AdminFooter from '../../components/AdminFooter';
import { Edit, Trash, Plus, Search, Filter } from 'lucide-react';
import './ProductsAdmin.css';
import '../AdminLayout.css';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category_name: string;
  image_url: string;
  stock_quantity: number;
  is_active: boolean;
  created_at: string;
}

interface Category {
  id: number;
  name: string;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    image_url: '',
    stock_quantity: '',
    sizes: '',
    colors: ''
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/backend/api/admin/products.php');
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/backend/api/admin/categories.php');
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
    }
  };

  const handleAddProduct = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category_id: '',
      image_url: '',
      stock_quantity: '',
      sizes: '',
      colors: ''
    });
    setIsEditing(false);
    setShowProductModal(true);
  };

  const handleEditProduct = (product: Product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category_id: '', // À récupérer depuis l'API
      image_url: product.image_url,
      stock_quantity: product.stock_quantity.toString(),
      sizes: '',
      colors: ''
    });
    setSelectedProduct(product);
    setIsEditing(true);
    setShowProductModal(true);
  };

  const handleDeleteProduct = (product: Product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`/backend/api/admin/products.php?id=${selectedProduct.id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        fetchProducts();
        setShowDeleteModal(false);
        setSelectedProduct(null);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing 
        ? `/backend/api/admin/products.php?id=${selectedProduct.id}`
        : '/backend/api/admin/products.php';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        fetchProducts();
        setShowProductModal(false);
        setSelectedProduct(null);
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || product.category_name === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
            <h1 className="admin-page-title">Gestion des Produits</h1>
            <button className="admin-btn" onClick={handleAddProduct}>
              <Plus size={16} style={{ marginRight: '8px' }} />
              Ajouter un Produit
            </button>
          </div>

          {/* Filtres */}
          <div className="admin-card">
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', flex: '1', minWidth: '200px' }}>
                <Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
                <input
                  type="text"
                  placeholder="Rechercher un produit..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="admin-form-input"
                  style={{ paddingLeft: '44px' }}
                />
              </div>
              <div style={{ minWidth: '150px' }}>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="admin-form-select"
                >
                  <option value="">Toutes les catégories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Liste des produits */}
          <div className="admin-card">
            {filteredProducts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>
                Aucun produit trouvé
              </div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Nom</th>
                    <th>Catégorie</th>
                    <th>Prix</th>
                    <th>Stock</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map(product => (
                    <tr key={product.id}>
                      <td>
                        <img 
                          src={product.image_url} 
                          alt={product.name}
                          style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }}
                        />
                      </td>
                      <td style={{ fontWeight: '600' }}>{product.name}</td>
                      <td>{product.category_name}</td>
                      <td style={{ fontWeight: '600', color: '#3b82f6' }}>{product.price}€</td>
                      <td>
                        <span style={{ 
                          color: product.stock_quantity > 10 ? '#10b981' : product.stock_quantity > 0 ? '#f59e0b' : '#ef4444',
                          fontWeight: '600'
                        }}>
                          {product.stock_quantity}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${product.is_active ? 'status-delivered' : 'status-cancelled'}`}>
                          {product.is_active ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => handleEditProduct(product)}
                            style={{ 
                              background: 'none', 
                              border: 'none', 
                              cursor: 'pointer',
                              padding: '8px',
                              borderRadius: '4px',
                              color: '#3b82f6'
                            }}
                            title="Modifier"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product)}
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

          {/* Modal Produit */}
          {showProductModal && (
            <div className="admin-modal">
              <div className="admin-modal-content">
                <div className="admin-modal-header">
                  <h2 className="admin-modal-title">
                    {isEditing ? 'Modifier le Produit' : 'Ajouter un Produit'}
                  </h2>
                  <button 
                    className="admin-close-btn"
                    onClick={() => setShowProductModal(false)}
                  >
                    ×
                  </button>
                </div>
                
                <form onSubmit={handleSubmit} className="admin-form">
                  <div className="admin-form-group">
                    <label className="admin-form-label">Nom du produit</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="admin-form-input"
                      required
                    />
                  </div>
                  
                  <div className="admin-form-group">
                    <label className="admin-form-label">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="admin-form-textarea"
                      rows={4}
                      required
                    />
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="admin-form-group">
                      <label className="admin-form-label">Prix (€)</label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="admin-form-input"
                        step="0.01"
                        required
                      />
                    </div>
                    
                    <div className="admin-form-group">
                      <label className="admin-form-label">Stock</label>
                      <input
                        type="number"
                        name="stock_quantity"
                        value={formData.stock_quantity}
                        onChange={handleInputChange}
                        className="admin-form-input"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="admin-form-group">
                    <label className="admin-form-label">Catégorie</label>
                    <select
                      name="category_id"
                      value={formData.category_id}
                      onChange={handleInputChange}
                      className="admin-form-select"
                      required
                    >
                      <option value="">Sélectionner une catégorie</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="admin-form-group">
                    <label className="admin-form-label">URL de l'image</label>
                    <input
                      type="url"
                      name="image_url"
                      value={formData.image_url}
                      onChange={handleInputChange}
                      className="admin-form-input"
                      required
                    />
                  </div>
                  
                  <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end', marginTop: '24px' }}>
                    <button
                      type="button"
                      onClick={() => setShowProductModal(false)}
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
                    <button type="submit" className="admin-btn">
                      {isEditing ? 'Modifier' : 'Ajouter'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Modal de confirmation suppression */}
          {showDeleteModal && (
            <div className="admin-modal">
              <div className="admin-modal-content">
                <div className="admin-modal-header">
                  <h2 className="admin-modal-title">Confirmer la suppression</h2>
                  <button 
                    className="admin-close-btn"
                    onClick={() => setShowDeleteModal(false)}
                  >
                    ×
                  </button>
                </div>
                
                <p style={{ marginBottom: '24px', color: '#6b7280' }}>
                  Êtes-vous sûr de vouloir supprimer le produit "{selectedProduct?.name}" ?
                  Cette action est irréversible.
                </p>
                
                <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => setShowDeleteModal(false)}
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
                    onClick={confirmDelete}
                    className="admin-btn admin-btn-danger"
                  >
                    Supprimer
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

export default Products;
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
          <div className="products-cards-grid">
            {products.length === 0 ? (
              <div className="products-empty">Aucun produit trouvé.</div>
            ) : (
              <>
                {products.map(prod => (
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
                      <img src={prod.image} alt={prod.name} onError={e => (e.currentTarget.src = '/mock/noimg.jpg')} />
                    </div>
                    <div className="product-card-body">
                      <div className="product-card-name">{prod.name}</div>
                      <div className="product-card-cat">{prod.category}</div>
                      <div className="product-card-price">{prod.price.toFixed(2)} €</div>
                    </div>
                  </div>
                ))}

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
                <div className="product-card product-card-add">
                  <button className="product-add-btn" title="Ajouter un produit">
                    <span className="product-add-plus">+</span>
                    <span className="product-add-txt">Ajouter</span>
                  </button>
                </div>
              </>
            )}
          </div>
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
