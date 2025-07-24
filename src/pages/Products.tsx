import React from 'react';
import { Link } from 'react-router-dom';
import './Products.css'; // Pour l'animation de scroll

import { useEffect, useState } from 'react';
import { getPhpApiUrl } from '../utils/api';


// old static data
/*
*
*    Remove on line 72
* 
*/
import { Exampleproducts } from "./exampleProducts"; 

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
}



const getProductImageUrl = (imageUrl: string | null) => {
  if (!imageUrl) return '/mock/noimg.jpg';
  // If imageUrl is already a full URL, return as is
  if (imageUrl.startsWith('http')) return imageUrl;
  // Otherwise, assume it's a relative path from PHP API (e.g., uploads/products/xxx.jpg)
  return `/uploads/products/${imageUrl.replace(/^.*[\\\/]/, '')}`;
};

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch categories first
    fetch(getPhpApiUrl('admin/get_all_categories.php'))
      .then(res => res.json())
      .then(data => {
        setCategories(data.categories || []);
      });
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch(getPhpApiUrl('api/products/read.php'))
      .then(res => res.json())
      .then(data => {
        if (data.products) {
          setProducts(
            data.products.map((p: any) => ({
              id: p.id,
              name: p.name,
              price: p.price,
              description: p.description || '',
              image: getProductImageUrl(p.image_url),
              category:
                categories.find(c => c.id === p.category_id)?.name || 'Inconnu',
            }))
          );
        } else {
          setError('Aucun produit trouvé.');
        }
        // Old static data
        setProducts(Exampleproducts.map(p => ({...p, description: ''})));
      })
      .catch(() => setError('Erreur lors du chargement des produits.'))
      .finally(() => setLoading(false));
  }, [categories]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  }
  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-light text-black mb-12 text-center">Nos Produits</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map(product => (
            <div key={product.id} className=" bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:-translate-y-2 hover:shadow-2xl">
              <Link to={`/product/${product.id}`}>
                <div className="relative w-full h-56">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" onError={e => (e.currentTarget.src = '/mock/noimg.jpg')} />
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