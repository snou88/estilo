import { useState, useEffect } from 'react';
import { Edit, Trash, Plus, X, Save, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import AdminHeader from '../../components/AdminHeader';
import AdminFooter from '../../components/AdminFooter';
import { getAdminPhpApiUrl } from '../../utils/api';

// Types pour TypeScript
interface Size {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
  sizes: Size[];
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

// Composant Modal réutilisable
const Modal = ({ isOpen, onClose, children, title }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

const CategorySizeManager = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // États pour les modales
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [showAddSizeModal, setShowAddSizeModal] = useState(false);
  const [showEditSizeModal, setShowEditSizeModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // États pour les formulaires
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editCategoryData, setEditCategoryData] = useState<{ id: number; name: string } | null>(null);
  const [newSizeName, setNewSizeName] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [editSizeData, setEditSizeData] = useState<{ id: number; name: string; categoryId: number } | null>(null);
  const [deleteItem, setDeleteItem] = useState<{ type: 'category' | 'size'; id: number; name: string; categoryId?: number } | null>(null);
  
  // États pour les actions
  const [actionLoading, setActionLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // États pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPageMobile = 2; // 2 catégories par page sur mobile
  
  // Réinitialiser à la première page quand les catégories changent
  useEffect(() => {
    setCurrentPage(1);
  }, [categories.length]);
  
  // Charger les catégories et tailles
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch(getAdminPhpApiUrl('api/get_categories_with_sizes.php'));
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des données');
      }
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      setError('Erreur lors du chargement des données');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Gestion des catégories
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    
    try {
      setActionLoading(true);
      const response = await fetch(getAdminPhpApiUrl('api/add_category.php'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategoryName.trim() })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setCategories(prev => [...prev, { ...data, sizes: [] }]);
        setNewCategoryName('');
        setShowAddCategoryModal(false);
        setSuccessMessage('Catégorie ajoutée avec succès');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        throw new Error(data.error || 'Erreur lors de l\'ajout');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'ajout');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditCategory = async () => {
    if (!editCategoryData || !editCategoryData.name.trim()) return;
    
    try {
      setActionLoading(true);
      const response = await fetch(getAdminPhpApiUrl('api/update_category.php'), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editCategoryData.id, name: editCategoryData.name.trim() })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setCategories(prev => prev.map(cat => 
          cat.id === editCategoryData.id ? { ...cat, name: editCategoryData.name.trim() } : cat
        ));
        setEditCategoryData(null);
        setShowEditCategoryModal(false);
        setSuccessMessage('Catégorie modifiée avec succès');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        throw new Error(data.error || 'Erreur lors de la modification');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la modification');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!deleteItem || deleteItem.type !== 'category') return;
    
    try {
      setActionLoading(true);
      const response = await fetch(getAdminPhpApiUrl('api/delete_category.php'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deleteItem.id })
      });
      
      if (response.ok) {
        setCategories(prev => prev.filter(cat => cat.id !== deleteItem.id));
        setDeleteItem(null);
        setShowDeleteModal(false);
        setSuccessMessage('Catégorie supprimée avec succès');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Erreur lors de la suppression');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    } finally {
      setActionLoading(false);
    }
  };

  // Gestion des tailles
  const handleAddSize = async () => {
    if (!newSizeName.trim() || !selectedCategoryId) return;
    
    try {
      setActionLoading(true);
      const response = await fetch(getAdminPhpApiUrl('api/add_size_to_category.php'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category_id: selectedCategoryId, size_name: newSizeName.trim() })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setCategories(prev => prev.map(cat => {
          if (cat.id === selectedCategoryId) {
            return { ...cat, sizes: [...cat.sizes, data] };
          }
          return cat;
        }));
        setNewSizeName('');
        setSelectedCategoryId(null);
        setShowAddSizeModal(false);
        setSuccessMessage('Taille ajoutée avec succès');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        throw new Error(data.error || 'Erreur lors de l\'ajout');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'ajout');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditSize = async () => {
    if (!editSizeData || !editSizeData.name.trim()) return;
    
    try {
      setActionLoading(true);
      const response = await fetch(getAdminPhpApiUrl('api/update_size.php'), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editSizeData.id, name: editSizeData.name.trim() })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setCategories(prev => prev.map(cat => {
          if (cat.id === editSizeData.categoryId) {
            return {
              ...cat,
              sizes: cat.sizes.map(size => 
                size.id === editSizeData.id ? { ...size, name: editSizeData.name.trim() } : size
              )
            };
          }
          return cat;
        }));
        setEditSizeData(null);
        setShowEditSizeModal(false);
        setSuccessMessage('Taille modifiée avec succès');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        throw new Error(data.error || 'Erreur lors de la modification');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la modification');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteSize = async () => {
    if (!deleteItem || deleteItem.type !== 'size') return;
    
    try {
      setActionLoading(true);
      const response = await fetch(getAdminPhpApiUrl('api/delete_size.php'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deleteItem.id })
      });
      
      if (response.ok) {
        setCategories(prev => prev.map(cat => {
          if (cat.id === deleteItem.categoryId) {
            return { ...cat, sizes: cat.sizes.filter(size => size.id !== deleteItem.id) };
          }
          return cat;
        }));
        setDeleteItem(null);
        setShowDeleteModal(false);
        setSuccessMessage('Taille supprimée avec succès');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Erreur lors de la suppression');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    } finally {
      setActionLoading(false);
    }
  };

  // Fonctions utilitaires
  const openEditCategoryModal = (category: Category) => {
    setEditCategoryData({ id: category.id, name: category.name });
    setShowEditCategoryModal(true);
  };

  const openEditSizeModal = (size: Size, categoryId: number) => {
    setEditSizeData({ id: size.id, name: size.name, categoryId });
    setShowEditSizeModal(true);
  };

  const openDeleteModal = (type: 'category' | 'size', id: number, name: string, categoryId?: number) => {
    setDeleteItem({ type, id, name, categoryId });
    setShowDeleteModal(true);
  };

  const closeAllModals = () => {
    setShowAddCategoryModal(false);
    setShowEditCategoryModal(false);
    setShowAddSizeModal(false);
    setShowEditSizeModal(false);
    setShowDeleteModal(false);
    setNewCategoryName('');
    setNewSizeName('');
    setEditCategoryData(null);
    setEditSizeData(null);
    setDeleteItem(null);
    setSelectedCategoryId(null);
    setError('');
  };

  // Fonctions pour la pagination
  const totalPages = Math.ceil(categories.length / itemsPerPageMobile);
  
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };
  
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };
  
  // Fonction pour obtenir les catégories à afficher en fonction de la page actuelle
  const getCurrentCategories = () => {
    if (window.innerWidth >= 640) { // sm breakpoint de Tailwind
      return categories; // Afficher toutes les catégories sur les grands écrans
    } else {
      // Pagination pour mobile : 2 catégories par page
      const startIndex = (currentPage - 1) * itemsPerPageMobile;
      return categories.slice(startIndex, startIndex + itemsPerPageMobile);
    }
  };

  if (loading) {
    return (
      <div className="admin-layout">
        <div className="admin-main">
          <AdminHeader />
          <main className="admin-content">
            <div className="flex items-center justify-center min-h-screen">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          </main>
          <AdminFooter />
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <div className="admin-main">
        <AdminHeader />
        <main className="admin-content">
          <div className="bg-gray-50 min-h-screen py-4 sm:py-8">
            <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des Catégories & Tailles</h1>
                <p className="text-gray-600">Gérez vos catégories de produits et leurs tailles associées</p>
              </div>

              {/* Messages de succès/erreur */}
              {successMessage && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Save className="h-5 w-5 text-green-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-800">{successMessage}</p>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-red-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-red-800">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Bouton d'ajout de catégorie */}
              <div className="mb-4 sm:mb-6">
                <button
                  onClick={() => setShowAddCategoryModal(true)}
                  className="w-full sm:w-auto inline-flex justify-center items-center px-3 sm:px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-1 sm:mr-2" />
                  <span className="text-xs sm:text-sm">Ajouter une catégorie</span>
                </button>
              </div>

              {/* Liste des catégories en grille responsive */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
                {getCurrentCategories().length > 0 ? (
                  getCurrentCategories().map((category) => (
                    <div key={category.id} className="w-full">
                      <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col">
                        <div className="p-3 sm:p-4 border-b border-gray-200 flex justify-between items-center">
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{category.name}</h3>
                          <div className="flex space-x-1 sm:space-x-2">
                            <button
                              onClick={() => openEditCategoryModal(category)}
                              className="p-1 text-blue-600 hover:text-blue-800 focus:outline-none"
                              title="Modifier la catégorie"
                            >
                              <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </button>
                            <button
                              onClick={() => openDeleteModal('category', category.id, category.name)}
                              className="p-1 text-red-600 hover:text-red-800 focus:outline-none"
                              title="Supprimer la catégorie"
                            >
                              <Trash className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedCategoryId(category.id);
                                setShowAddSizeModal(true);
                              }}
                              className="p-1 text-green-600 hover:text-green-800 focus:outline-none"
                              title="Ajouter une taille"
                            >
                              <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </button>
                          </div>
                        </div>

                        {/* Tailles de la catégorie */}
                        <div className="p-4">
                          {category.sizes.length === 0 ? (
                            <p className="text-gray-500 text-sm italic">Aucune taille définie pour cette catégorie</p>
                          ) : (
                            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {category.sizes.map((size) => (
                                <li key={size.id} className="flex justify-between items-center bg-gray-50 px-2 py-1.5 sm:px-3 sm:py-2 rounded">
                                  <span className="text-xs sm:text-sm text-gray-800 truncate">{size.name}</span>
                                  <div className="flex space-x-1 sm:space-x-2">
                                    <button
                                      onClick={() => openEditSizeModal(size, category.id)}
                                      className="text-blue-600 hover:text-blue-800 focus:outline-none"
                                      title="Modifier la taille"
                                    >
                                      <Edit className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                    </button>
                                    <button
                                      onClick={() => openDeleteModal('size', size.id, size.name, category.id)}
                                      className="text-red-600 hover:text-red-800 focus:outline-none"
                                      title="Supprimer la taille"
                                    >
                                      <Trash className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                    </button>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full">
                    <p className="mt-1 text-sm text-gray-500 text-center">Aucune catégorie à afficher. {currentPage > 1 ? 'Revenez à la première page.' : 'Commencez par ajouter votre première catégorie.'}</p>
                  </div>
                )}
              </div>
              
              {/* Contrôles de pagination (uniquement sur mobile) */}
              <div className="sm:hidden flex justify-between items-center mt-4">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className={`flex items-center px-4 py-2 rounded-md ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}
                >
                  <ChevronLeft className="h-5 w-5 mr-1" />
                  Précédent
                </button>
                
                <span className="text-sm text-gray-600">
                  Page {currentPage} sur {totalPages || 1}
                </span>
                
                <button
                  onClick={handleNextPage}
                  disabled={currentPage >= totalPages}
                  className={`flex items-center px-4 py-2 rounded-md ${currentPage >= totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}
                >
                  Suivant
                  <ChevronRight className="h-5 w-5 ml-1" />
                </button>
              </div>
              {categories.length === 0 && (
                <div className="text-center py-12">
                  <div className="mx-auto h-12 w-12 text-gray-400">
                    <Plus className="h-12 w-12" />
                  </div>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune catégorie</h3>
                  <p className="mt-1 text-sm text-gray-500">Commencez par ajouter votre première catégorie.</p>
                  <div className="mt-6">
                    <button
                      onClick={() => setShowAddCategoryModal(true)}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter une catégorie
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
        <AdminFooter />
      </div>

      {/* Modal d'ajout de catégorie */}
      <Modal
        isOpen={showAddCategoryModal}
        onClose={closeAllModals}
        title="Ajouter une catégorie"
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 mb-1">
              Nom de la catégorie
            </label>
            <input
              type="text"
              id="categoryName"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ex: T-shirts, Pantalons..."
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={closeAllModals}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Annuler
            </button>
            <button
              onClick={handleAddCategory}
              disabled={actionLoading || !newCategoryName.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {actionLoading ? 'Ajout...' : 'Ajouter'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal de modification de catégorie */}
      <Modal
        isOpen={showEditCategoryModal}
        onClose={closeAllModals}
        title="Modifier la catégorie"
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="editCategoryName" className="block text-sm font-medium text-gray-700 mb-1">
              Nom de la catégorie
            </label>
            <input
              type="text"
              id="editCategoryName"
              value={editCategoryData?.name || ''}
              onChange={(e) => setEditCategoryData(prev => prev ? { ...prev, name: e.target.value } : null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={closeAllModals}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Annuler
            </button>
            <button
              onClick={handleEditCategory}
              disabled={actionLoading || !editCategoryData?.name.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {actionLoading ? 'Modification...' : 'Modifier'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal d'ajout de taille */}
      <Modal
        isOpen={showAddSizeModal}
        onClose={closeAllModals}
        title="Ajouter une taille"
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="sizeName" className="block text-sm font-medium text-gray-700 mb-1">
              Nom de la taille
            </label>
            <input
              type="text"
              id="sizeName"
              value={newSizeName}
              onChange={(e) => setNewSizeName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ex: S, M, L, XL..."
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={closeAllModals}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Annuler
            </button>
            <button
              onClick={handleAddSize}
              disabled={actionLoading || !newSizeName.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {actionLoading ? 'Ajout...' : 'Ajouter'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal de modification de taille */}
      <Modal
        isOpen={showEditSizeModal}
        onClose={closeAllModals}
        title="Modifier la taille"
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="editSizeName" className="block text-sm font-medium text-gray-700 mb-1">
              Nom de la taille
            </label>
            <input
              type="text"
              id="editSizeName"
              value={editSizeData?.name || ''}
              onChange={(e) => setEditSizeData(prev => prev ? { ...prev, name: e.target.value } : null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={closeAllModals}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Annuler
            </button>
            <button
              onClick={handleEditSize}
              disabled={actionLoading || !editSizeData?.name.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {actionLoading ? 'Modification...' : 'Modifier'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal de confirmation de suppression */}
      <Modal
        isOpen={showDeleteModal}
        onClose={closeAllModals}
        title="Confirmer la suppression"
      >
        <div className="space-y-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertCircle className="h-6 w-6 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-700">
                Êtes-vous sûr de vouloir supprimer{' '}
                <span className="font-medium text-gray-900">
                  "{deleteItem?.name}"
                </span>
                {deleteItem?.type === 'size' ? ' (taille)' : ' (catégorie)'} ?
              </p>
              {deleteItem?.type === 'category' && (
                <p className="text-sm text-red-600 mt-1">
                  Attention : Toutes les tailles associées seront également supprimées.
                </p>
              )}
            </div>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={closeAllModals}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Annuler
            </button>
            <button
              onClick={deleteItem?.type === 'category' ? handleDeleteCategory : handleDeleteSize}
              disabled={actionLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {actionLoading ? 'Suppression...' : 'Supprimer'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CategorySizeManager;