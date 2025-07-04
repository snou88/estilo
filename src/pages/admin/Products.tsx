import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import AdminHeader from '../../components/AdminHeader';
import AdminFooter from '../../components/AdminFooter';
import './AdminSection.css';
import './ProductsAdmin.css';
import model from '../../assets/images/products/model.png';
import { Edit, Trash } from 'lucide-react';

// Données mock pour démo
const MOCK_PRODUCTS = [
  { id: 1, name: 'T-shirt Estilo', category: 'Vêtements', price: 19.99, image: model },
  { id: 2, name: 'Sweat Capuche', category: 'Vêtements', price: 39.99, image: model },
  { id: 3, name: 'Jean Slim', category: 'Vêtements', price: 49.99, image: model },
  { id: 4, name: 'Casquette Logo', category: 'Accessoires', price: 14.99, image: model },
  { id: 5, name: 'Sac à dos', category: 'Accessoires', price: 29.99, image: model },
  { id: 6, name: 'Chaussettes', category: 'Vêtements', price: 7.99, image: model },
  { id: 7, name: 'Veste Denim', category: 'Vêtements', price: 59.99, image: model },
  { id: 8, name: 'Short été', category: 'Vêtements', price: 22.99, image: model },
  { id: 9, name: 'Chemise blanche', category: 'Vêtements', price: 27.99, image: model },
  { id: 10, name: 'Bonnet hiver', category: 'Accessoires', price: 11.99, image: model },
  { id: 11, name: 'Polo classique', category: 'Vêtements', price: 24.99, image: model },
  { id: 12, name: 'Ceinture cuir', category: 'Accessoires', price: 17.99, image: model },
];

const ITEMS_PER_PAGE = 6;

const Products = () => {
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const [animate, setAnimate] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  useEffect(() => {
    setAnimate(true);
    return () => setAnimate(false);
  }, []);

  // Actions modale
  const handleDelete = (prod: any) => {
    setSelectedProduct(prod);
    setShowDeleteModal(true);
  };
  const handleEdit = (prod: any) => {
    setSelectedProduct(prod);
    setShowEditModal(true);
  };
  const confirmDelete = () => {
    // Ici, supprimer le produit (API ou setState)
    setShowDeleteModal(false);
    setSelectedProduct(null);
    // Optionnel : afficher une notification
  };
  const confirmEdit = () => {
    // Ici, ouvrir un vrai formulaire d’édition ou valider la modif
    setShowEditModal(false);
    setSelectedProduct(null);
    // Optionnel : afficher une notification
  };

  // Filtrage
  const filtered = MOCK_PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(filter.toLowerCase())
  );
  // Pagination
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const products = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handlePage = (n: number) => {
    setAnimate(false);
    setTimeout(() => {
      setPage(n);
      setAnimate(true);
    }, 120);
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
