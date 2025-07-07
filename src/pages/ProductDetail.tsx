import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Truck, Shield, RefreshCw, Star } from 'lucide-react';

const wilayas = [
  'Adrar', 'Chlef', 'Laghouat', 'Oum El Bouaghi', 'Batna', 'Béjaïa', 'Biskra', 'Béchar', 'Blida', 'Bouira',
  'Tamanrasset', 'Tébessa', 'Tlemcen', 'Tiaret', 'Tizi Ouzou', 'Alger', 'Djelfa', 'Jijel', 'Sétif', 'Saïda',
  'Skikda', 'Sidi Bel Abbès', 'Annaba', 'Guelma', 'Constantine', 'Médéa', 'Mostaganem', 'M’Sila', 'Mascara', 'Ouargla',
  'Oran', 'El Bayadh', 'Illizi', 'Bordj Bou Arreridj', 'Boumerdès', 'El Tarf', 'Tindouf', 'Tissemsilt', 'El Oued', 'Khenchela',
  'Souk Ahras', 'Tipaza', 'Mila', 'Aïn Defla', 'Naâma', 'Aïn Témouchent', 'Ghardaïa', 'Relizane', 'Timimoun', 'Bordj Badji Mokhtar',
  'Ouled Djellal', 'Béni Abbès', 'In Salah', 'In Guezzam', 'Touggourt', 'Djanet', 'El M’Ghair', 'El Meniaa'
];

import p1 from '../photos/p1.png';

const mockProduct = {
  id: 1,
  name: 'Veste Élégante',
  price: 8999,
  oldPrice: 10999,
  image: p1,
  description: 'Une veste élégante, parfaite pour toutes les occasions. Conçue pour sublimer votre style, avec livraison rapide partout en Algérie.',
  sizes: ['S', 'M', 'L', 'XL'],
  colors: [
  { name: 'Noir', value: '#222' },
  { name: 'Bleu', value: '#2563eb' },
  { name: 'Gris', value: '#aaa' },
  { name: 'Rouge', value: '#e11d48' },
  { name: 'Vert', value: '#22c55e' }
],
  deliveryBase: 600, // DA
  badges: ['Nouveau', 'Best Seller', 'Livraison rapide']
};

const ProductDetail = () => {
  // const { id } = useParams(); // Pour une vraie base de données
  const [size, setSize] = useState('M');
  const [color, setColor] = useState('Noir');
  const [quantity, setQuantity] = useState(1);
  const [wilaya, setWilaya] = useState(wilayas[0]);

  // Prix livraison par wilaya (simplifié)
  const getDeliveryPrice = () => mockProduct.deliveryBase + (wilayas.indexOf(wilaya) % 5) * 200;
  const total = mockProduct.price * quantity + getDeliveryPrice();

  // Témoignages clients fictifs
  const testimonials = [
    {
      name: 'Sami B.',
      text: 'Livraison rapide, produit de qualité, je recommande à 100%!',
      stars: 5
    },
    {
      name: 'Nadia K.',
      text: 'Super service client, la veste est magnifique!',
      stars: 5
    },
    {
      name: 'Yacine A.',
      text: 'Commande facile et livraison à Alger en 2 jours!',
      stars: 4
    }
  ];

  return (
    <div className="min-h-screen py-12 px-4 bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-8 flex flex-col md:flex-row gap-10 relative overflow-hidden">
        {/* Badges */}
        <div className="absolute left-0 top-0 flex gap-2 p-2 z-10">
          {mockProduct.badges.map((badge, i) => (
            <span key={i} className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-bounce">
              {badge}
            </span>
          ))}
        </div>
        {/* Image + couleurs */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="relative w-full max-w-xs h-64 sm:h-80 md:w-80 md:h-80 mb-4 rounded-xl overflow-hidden shadow-lg border-4 border-blue-100 mx-auto">
            <img src={mockProduct.image} alt={mockProduct.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
          </div>
          <div className="flex gap-3 mt-2">
            {mockProduct.colors.map((c) => (
              <button
                key={c.name}
                className={`w-8 h-8 rounded-full border-2 ${color === c.name ? 'border-blue-600 ring-2 ring-blue-400' : 'border-gray-300'} flex items-center justify-center transition-all`}
                style={{ background: c.value }}
                onClick={() => setColor(c.name)}
                aria-label={c.name}
              />
            ))}
          </div>
        </div>
        {/* Infos produit */}
        <div className="flex-1 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-2 text-blue-700 flex items-center gap-2">
            {mockProduct.name}
            <span className="ml-2 inline-block bg-yellow-300 text-yellow-900 rounded px-2 py-1 text-xs font-semibold">TOP</span>
          </h2>
          <p className="text-gray-600 mb-4 text-lg">{mockProduct.description}</p>
          <div className="flex gap-4 mb-4">
            <span className="font-medium">Taille :</span>
            {mockProduct.sizes.map(s => (
              <button key={s} onClick={() => setSize(s)} className={`px-3 py-1 rounded border ${size === s ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border-blue-600'} font-semibold transition-all`}>{s}</button>
            ))}
          </div>
          <div className="flex gap-4 mb-4 items-center">
            <span className="font-medium">Quantité :</span>
            <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-2 py-1 bg-gray-200 rounded-l hover:bg-blue-100">-</button>
            <input type="number" min={1} value={quantity} onChange={e => setQuantity(Math.max(1, Number(e.target.value)))} className="w-14 text-center border-t border-b border-gray-200" />
            <button onClick={() => setQuantity(q => q + 1)} className="px-2 py-1 bg-gray-200 rounded-r hover:bg-blue-100">+</button>
          </div>
          <div className="mb-4">
            <span className="font-medium">Wilaya :</span>
            <select value={wilaya} onChange={e => setWilaya(e.target.value)} className="ml-2 border rounded px-2 py-1">
              {wilayas.map(w => <option key={w} value={w}>{w}</option>)}
            </select>
          </div>
          <div className="flex items-end gap-4 mb-2">
            <span className="text-2xl font-bold text-blue-700">{mockProduct.price} DA</span>
            <span className="text-lg text-gray-400 line-through">{mockProduct.oldPrice} DA</span>
          </div>
          <div className="mb-2">
            <span className="font-medium">Livraison :</span> <span className="ml-2 text-blue-600 font-bold">{getDeliveryPrice()} DA</span>
          </div>
          <div className="mb-6 text-2xl font-extrabold text-green-600 border-t pt-4">
            Total à payer : {total} DA
          </div>
          <button className="w-full bg-gradient-to-r from-blue-600 to-green-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:scale-105 transition-all mb-2 animate-pulse">Commander maintenant</button>
          <div className="flex flex-col items-center justify-center gap-2 my-4 text-gray-600 text-sm
            md:flex-row md:gap-4">
            <span className="flex items-center gap-1"><Truck className="w-5 h-5" /> Livraison partout en Algérie</span>
            <span className="flex items-center gap-1"><Shield className="w-5 h-5" /> Paiement sécurisé</span>
            <span className="flex items-center gap-1"><RefreshCw className="w-5 h-5" /> Satisfait ou remboursé</span>
          </div>
          <div className="text-center text-gray-500 text-xs mb-2">Votre satisfaction est notre priorité. Service client 7j/7.</div>
          <Link to="/products" className="block mt-2 text-blue-600 hover:underline">← Retour aux produits</Link>
        </div>
      </div>
      {/* Témoignages */}
      <div className="max-w-3xl mx-auto mt-10">
        <h3 className="text-xl font-semibold text-center mb-6 text-gray-800">Ce que disent nos clients</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white rounded-xl shadow-md p-5 flex flex-col items-center">
              <div className="flex gap-1 mb-2">
                {[...Array(t.stars)].map((_, idx) => <Star key={idx} className="w-5 h-5 text-yellow-400 fill-current" />)}
              </div>
              <div className="italic text-gray-600 text-center mb-2">"{t.text}"</div>
              <div className="font-medium text-blue-700">{t.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
