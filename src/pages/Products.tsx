import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPhpApiUrl } from '../utils/api';
import './Products.css';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category_id: number;
  category_name: string;
  colors: string[];
}

interface Filters {
  category_id?: number;
  min_price?: number;
  max_price?: number;
  search?: string;
  color?: string;
}

const getProductImageUrl = (imageUrl: string | null) => {
  if (!imageUrl) return '/mock/noimg.jpg';
  if (imageUrl.startsWith('http')) return imageUrl;
  return `/uploads/products/${imageUrl.replace(/^.*[\\\/]/, '')}`;
};

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState<Filters>({});
  const [availableColors, setAvailableColors] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [showFilters, setShowFilters] = useState(false);

  // Fetch categories
  useEffect(() => {
    fetch(getPhpApiUrl('admin/get_all_categories.php'))
      .then(res => res.json())
      .then(data => {
        setCategories(data.categories || []);
      });
  }, []);

  // Fetch products with filters
  useEffect(() => {
    setLoading(true);
    
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        queryParams.append(key, String(value));
      }
    });

    fetch(`${getPhpApiUrl('api/products/read.php')}?${queryParams}`)
      .then(res => res.json())
      .then(data => {
        if (data.products) {
          const formattedProducts = data.products.map((p: any) => ({
            ...p,
            image: getProductImageUrl(p.image_url),
            colors: p.colors || []
          }));
          setProducts(formattedProducts);
          
          if (data.filters) {
            setAvailableColors(data.filters.colors || []);
            if (data.filters.price_range) {
              setPriceRange({
                min: data.filters.price_range.min,
                max: data.filters.price_range.max
              });
              
              setFilters(prev => ({
                ...prev,
                min_price: prev.min_price === undefined ? data.filters.price_range.min : prev.min_price,
                max_price: prev.max_price === undefined ? data.filters.price_range.max : prev.max_price
              }));
            }
          }
        } else {
          setError('Aucun produit trouvé.');
          setProducts([]);
        }
      })
      .catch(() => setError('Erreur lors du chargement des produits.'))
      .finally(() => setLoading(false));
  }, [filters]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value === '' ? undefined : value
    }));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'min' | 'max') => {
    const value = e.target.value ? parseFloat(e.target.value) : undefined;
    setFilters(prev => ({
      ...prev,
      [`${type}_price`]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      min_price: priceRange.min,
      max_price: priceRange.max
    });
  };

  if (loading && products.length === 0) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen py-10 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-light text-black mb-8 text-center">Nos Produits</h1>
        
        <div className="mb-6 lg:hidden">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded flex items-center justify-center"
          >
            {showFilters ? 'Masquer les filtres' : 'Afficher les filtres'}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden'} lg:block`}>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Filtres</h2>
              
              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Recherche</label>
                <input
                  type="text"
                  name="search"
                  value={filters.search || ''}
                  onChange={handleFilterChange}
                  placeholder="Rechercher un produit..."
                  className="w-full p-2 border rounded"
                />
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                <select
                  name="category_id"
                  value={filters.category_id || ''}
                  onChange={handleFilterChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Toutes les catégories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prix: {filters.min_price || priceRange.min} DA - {filters.max_price || priceRange.max} DA
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Min</label>
                    <input
                      type="number"
                      value={filters.min_price || ''}
                      onChange={(e) => handlePriceChange(e, 'min')}
                      min={priceRange.min}
                      max={priceRange.max}
                      placeholder={String(priceRange.min)}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Max</label>
                    <input
                      type="number"
                      value={filters.max_price || ''}
                      onChange={(e) => handlePriceChange(e, 'max')}
                      min={priceRange.min}
                      max={priceRange.max}
                      placeholder={String(priceRange.max)}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>
              </div>

              {/* Color Filter */}
              {availableColors.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Couleur</label>
                  <div className="flex flex-wrap gap-2">
                    {availableColors.map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setFilters(prev => ({
                          ...prev,
                          color: prev.color === color ? undefined : color
                        }))}
                        className={`w-8 h-8 rounded-full border ${filters.color === color ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
                        style={{ backgroundColor: color.toLowerCase() }}
                        title={color}
                        aria-label={`Filtrer par la couleur ${color}`}
                      />
                    ))}
                  </div>
                  {filters.color && (
                    <button
                      onClick={() => setFilters(prev => ({ ...prev, color: undefined }))}
                      className="mt-2 text-sm text-blue-600 hover:underline"
                    >
                      Effacer la sélection
                    </button>
                  )}
                </div>
              )}

              <button
                onClick={clearFilters}
                className="w-full mt-4 bg-black hover:bg-gray-800 text-white py-2 px-4 rounded transition"
              >
                Réinitialiser les filtres
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:w-3/4">
            {products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Aucun produit ne correspond à vos critères de recherche.</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 text-white hover:underline"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map(product => (
                  <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:-translate-y-2 hover:shadow-xl">
                    <Link to={`/product/${product.id}`}>
                      <div className="relative w-full h-64">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full object-cover" 
                          onError={e => (e.currentTarget as HTMLImageElement).src = '/mock/noimg.jpg'} 
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end">
                          <h2 className="text-lg font-signature text-white mb-4 ml-4 drop-shadow-lg" style={{fontFamily: 'Pacifico, cursive', textShadow: '0 2px 8px #000'}}>
                            {product.name}
                          </h2>
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="text-gray-600 mb-1">{product.category_name || 'Sans catégorie'}</p>
                        <p className="text-black font-bold text-xl">{product.price} DA</p>
                        
                        {/* Color indicators */}
                        {product.colors && product.colors.length > 0 && (
                          <div className="mt-2 flex items-center">
                            <span className="text-sm text-gray-600 mr-2">Couleurs:</span>
                            <div className="flex -space-x-2">
                              {product.colors.slice(0, 3).map((color, index) => (
                                <div 
                                  key={index}
                                  className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
                                  style={{ backgroundColor: color.toLowerCase() }}
                                  title={color}
                                />
                              ))}
                              {product.colors.length > 3 && (
                                <div className="w-5 h-5 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs">
                                  +{product.colors.length - 3}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        
                        <button className="mt-4 w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition">
                          Voir le produit
                        </button>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;