import React, { useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderSuccessPopup({ isOpen, onClose }: Props) {
  
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl shadow-2xl p-8 w-11/12 max-w-sm"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex flex-col items-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          >
            <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
          </motion.div>
          <h2 className="text-2xl font-semibold mb-2">Commande Confirmée !</h2>
          <p className="text-center text-gray-600 mb-6">
            Merci pour votre achat. Vous recevrez bientôt un e-mail de confirmation.
          </p>
          <button
            onClick={onClose}
            className="mt-auto px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          >
            Fermer
          </button>
        </div>
      </motion.div>
    </div>
  );
}
