import { useState, useEffect } from 'react';
import { CartItem } from '../types';

export const useCart = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Charger le panier depuis localStorage au démarrage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
  }, []);

  // Sauvegarder le panier dans localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addItem = (item: CartItem) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(
        i => i.product.id === item.product.id && 
             i.size === item.size && 
             i.color === item.color
      );

      if (existingItem) {
        return prevItems.map(i =>
          i === existingItem 
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }

      return [...prevItems, item];
    });
  };

  const removeItem = (productId: number, size: string, color: string) => {
    setItems(prevItems =>
      prevItems.filter(
        item => !(item.product.id === productId && 
                 item.size === size && 
                 item.color === color)
      )
    );
  };

  const updateQuantity = (productId: number, size: string, color: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId, size, color);
      return;
    }

    setItems(prevItems =>
      prevItems.map(item =>
        item.product.id === productId && 
        item.size === size && 
        item.color === color
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  return {
    items,
    isLoading,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
  };
};