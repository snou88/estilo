import React from 'react';
import { Link } from 'react-router-dom';
import './Products.css';

import p1 from './photos/p1.png';
import p2 from './photos/p2.png';
import p3 from './photos/p3.png';
import p5 from './photos/p5.png';
import p6 from './photos/p6.png';

const products = [
  {
    id: 1,
    name: 'Veste Élégante',
    price: 8990,
    image: p1,
    category: 'Vestes'
  },
  {
    id: 2,
    name: 'Robe Kabyle',
    price: 12000,
    image: p2,
    category: 'Robes traditionnelles'
  },
  {
    id: 3,
    name: 'Chemise Homme',
    price: 3500,
    image: p3,
    category: 'Chemises'
  },
  {
    id: 4,
    name: 'Pantalon Jean',
    price: 5500,
    image: p5,
    category: 'Pantalons'
  },
  {
    id: 5,
    name: 'Babouches cuir',
    price: 2500,
    image: p6,
    category: 'Chaussures'
  },
  {
    id: 6,
    name: 'Sandales Femme',
    price: 2200,
    image: p1,
    category: 'Chaussures'
  },
  {
    id: 7,
    name: 'Montre Homme',
    price: 4500,
    image: p2,
    category: 'Accessoires'
  },
  {
    id: 8,
    name: 'Sac à main',
    price: 6000,
    image: p3,
    category: 'Accessoires'
  },
  {
    id: 9,
    name: 'T-shirt Algérie',
    price: 1800,
    image: p5,
    category: 'T-shirts'
  },
  {
    id: 10,
    name: 'Casquette DZ',
    price: 1200,
    image: p6,
    category: 'Accessoires'
  }
];

const Products = () => {
  return (
    <div className="min-h-screen py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-light text-black mb-12 text-center">Nos Produits</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map(product => (
            <div key={product.id} className="product-card bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:-translate-y-2 hover:shadow-2xl">
              <Link to={`/product/${product.id}`} className="block">
                <div className="relative w-full h-64 sm:h-72">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end">
                    <h2 className="text-lg font-signature text-white mb-4 ml-4 drop-shadow-lg" style={{fontFamily: 'Pacifico, cursive', textShadow: '0 2px 8px #000'}}> {product.name} </h2>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-gray-600 mb-1">{product.category}</p>
                  <p className="text-blue-600 font-bold text-xl">{product.price} DA</p>
                  <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">Voir le produit</button>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;