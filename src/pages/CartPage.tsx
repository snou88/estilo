import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { X, Plus, Minus } from 'lucide-react';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity, 
    0
  );
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-DZ', {
      style: 'currency',
      currency: 'DZD'
    }).format(price);
  };

  if (cartItems.length === 0) {
    return (
      <div
        className="max-w-7xl mx-auto px-4 py-12 text-center"
        style={{ paddingTop: '15%', paddingBottom: '15%' }}
      >
        <h1 className="text-3xl font-bold mb-6">Votre Panier est Vide</h1>
        <p className="text-gray-600 mb-8">
          Commencez à ajouter des articles à votre panier
        </p>
        <Link 
          to="/products" 
          className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition"
        >
          Parcourir les Produits
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12"
    style={{ paddingTop: '5%', paddingBottom: '10%' }}
    >
      <h1 className="text-3xl font-bold mb-8">Votre Panier</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            {cartItems.map(item => (
              <div 
                key={`${item.id}-${item.color}-${item.size}`} 
                className="flex items-center p-6 border-b border-gray-100 last:border-b-0"
              >
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-24 h-24 object-cover rounded-md"
                />
                
                <div className="ml-6 flex-1">
                  <div className="flex justify-between">
                    <Link to={`/product/${item.id}`} className="font-medium hover:underline">
                      {item.name}
                    </Link>
                    <button 
                      onClick={() => removeFromCart(item.id, item.color, item.size)}
                      className="text-gray-400 hover:text-black"
                    >
                      <X size={18} />
                    </button>
                  </div>
                  
                  <div className="mt-2 flex items-center">
                    <div 
                      className="w-4 h-4 rounded-full border border-gray-200 mr-2" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-gray-600">Taille: {item.size}</span>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center border border-gray-200 rounded">
                      <button 
                        onClick={() => updateQuantity(item.id, item.color, item.size, item.quantity - 1)}
                        className="p-2 text-gray-500 hover:bg-gray-50"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="px-4">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.color, item.size, item.quantity + 1)}
                        className="p-2 text-gray-500 hover:bg-gray-50"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    
                    <div className="font-medium">{formatPrice(item.price * item.quantity)}</div>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="p-6 flex justify-end">
              <button 
                onClick={clearCart}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Vider le panier
              </button>
            </div>
          </div>
        </div>
        
        {/* Order Summary */}
        <div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold mb-6">Résumé de la commande</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Sous-total</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Livraison</span>
                <span className="text-gray-600">Calculé à l'étape suivante</span>
              </div>
              
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
              </div>
            </div>
            
            <button className="w-full bg-black text-white py-3 rounded-md mt-8 hover:bg-gray-800 transition">
              Passer la commande
            </button>
            
            <div className="mt-6 text-center">
              <Link 
                to="/products" 
                className="text-sm text-gray-600 hover:text-black hover:underline"
              >
                Continuer vos achats
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;