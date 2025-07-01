import React from 'react';
import { Product } from '../types/Product';
import model from '../assets/images/products/model.png';

// Exemple de données de produits (à remplacer par vos données réelles)
const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Robe Élégante',
    price: 199.99,
    description: 'Une robe élégante et sophistiquée pour vos occasions spéciales.',
    image: model,
    category: 'Robes',
    inStock: true
  },
  {
    id: 2,
    name: 'Veste Classique',
    price: 149.99,
    description: 'Une veste élégante qui s\'adapte à toutes les occasions.',
    image: model,
    category: 'Vêtements',
    inStock: true
  },
  {
    id: 3,
    name: 'Sac à Main',
    price: 249.99,
    description: 'Un sac à main élégant et fonctionnel.',
    image:model,
    category: 'Accessoires',
    inStock: true
  }
];

const Products = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Nos Produits</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Découvrez notre collection exclusive de vêtements et accessoires de haute qualité.
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockProducts.map((product) => (
            <div key={product.id} className="group relative">
              {/* Image Container */}
              <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
                <img
                  src={product.image}
                  alt={product.name}
                  className="object-cover object-center group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              {/* Product Info */}
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                  {product.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500">{product.category}</p>
                <p className="mt-2 text-base font-medium text-gray-900">
                  {product.price} €
                </p>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 transition-opacity duration-300 flex items-center justify-center">
                <button className="px-8 py-3 bg-white text-gray-800 font-medium rounded-lg shadow-lg hover:bg-gray-50 transition-colors duration-200">
                  Voir Plus
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;