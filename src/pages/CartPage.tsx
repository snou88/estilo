import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { X, Plus, Minus, CheckCircle, AlertCircle } from 'lucide-react';
import CheckoutModal from '../components/CheckoutModal';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderError, setOrderError] = useState('');
  
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

  const handleCheckout = async (orderData: any) => {
    setOrderLoading(true);
    setOrderError('');

    try {
      const orderPayload = {
        ...orderData,
        items: cartItems.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          unit_price: item.price
        }))
      };

      const response = await fetch('http://localhost/estilo/api/create_order.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload)
      });

      const data = await response.json();

      if (response.ok) {
        setOrderSuccess(true);
        clearCart();
        setShowCheckoutModal(false);
        setTimeout(() => setOrderSuccess(false), 5000);
      } else {
        throw new Error(data.error || 'Erreur lors de la création de la commande');
      }
    } catch (error) {
      setOrderError(error instanceof Error ? error.message : 'Erreur lors de la création de la commande');
    } finally {
      setOrderLoading(false);
    }
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
      
      {/* Messages de succès/erreur */}
      {orderSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckCircle className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                Commande créée avec succès ! Vous recevrez un email de confirmation.
              </p>
            </div>
          </div>
        </div>
      )}

      {orderError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">{orderError}</p>
            </div>
          </div>
        </div>
      )}
      
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
            
            <button 
              onClick={() => setShowCheckoutModal(true)}
              className="w-full bg-black text-white py-3 rounded-md mt-8 hover:bg-gray-800 transition"
            >
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

      {/* Modal de commande */}
      <CheckoutModal
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        onSubmit={handleCheckout}
        loading={orderLoading}
        subtotal={subtotal}
      />
    </div>
  );
};

export default CartPage;