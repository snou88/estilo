import React, { useState, useEffect } from 'react';
import { X, AlertCircle, CheckCircle } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (orderData: OrderData) => void;
  loading: boolean;
  subtotal: number;
}

interface OrderData {
  customer_name: string;
  customer_phone: string;
  shipping_address: string;
  shipping_city: string;
  shipping_zip: string;
  wilaya_id: number;
}

type Wilaya = { id: number; name: string; shipping_price: number };

const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  loading,
  subtotal
}) => {
  const [formData, setFormData] = useState<OrderData>({
    customer_name: '',
    customer_phone: '',
    shipping_address: '',
    shipping_city: '',
    shipping_zip: '',
    wilaya_id: 0
  });
  const [wilayas, setWilayas] = useState<Wilaya[]>([]);
  const [shippingPrice, setShippingPrice] = useState<number>(0);
  const [total, setTotal] = useState<number>(subtotal);

  useEffect(() => {
    fetch('http://localhost/estilo/api/get_wilayas.php')
      .then(res => res.json())
      .then(data => {
        setWilayas(data.wilayas);
        if (data.wilayas.length > 0) {
          setFormData(f => ({ ...f, wilaya_id: data.wilayas[0].id }));
          setShippingPrice(data.wilayas[0].shipping_price);
          setTotal(Number(subtotal) + Number(data.wilayas[0].shipping_price));
        }
      });
  }, [isOpen]);

  useEffect(() => {
    const selected = wilayas.find(w => w.id === formData.wilaya_id);
    if (selected) {
      const shipping = Number(selected.shipping_price);
      setShippingPrice(shipping);
      setTotal(Number(subtotal) + shipping);
    }
  }, [formData.wilaya_id, wilayas, subtotal]);

  const [errors, setErrors] = useState<Record<keyof OrderData, string>>({} as Record<keyof OrderData, string>);
  const [touched, setTouched] = useState<Partial<OrderData>>({});

  const validateField = (name: keyof OrderData, value: string) => {
    switch (name) {
      case 'customer_name':
        return value.trim().length < 2 ? 'Le nom doit contenir au moins 2 caractères' : '';
      case 'customer_phone':
        return !/^[0-9+\-\s()]{8,}$/.test(value) ? 'Numéro de téléphone invalide' : '';
      case 'shipping_address':
        return value.trim().length < 10 ? 'L\'adresse doit contenir au moins 10 caractères' : '';
      case 'shipping_city':
        return value.trim().length < 2 ? 'La ville doit contenir au moins 2 caractères' : '';
      case 'shipping_zip':
        return !/^[0-9]{5}$/.test(value) ? 'Code postal invalide (5 chiffres)' : '';
      default:
        return '';
    }
  };

  const handleInputChange = (name: keyof OrderData, value: string | number) => {
    setFormData(prev => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const error = validateField(name, value as string);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (name: keyof OrderData) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, formData[name] as string);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Valider tous les champs
    const newErrors: Record<keyof OrderData, string> = {} as Record<keyof OrderData, string>;
    Object.keys(formData).forEach(key => {
      const fieldName = key as keyof OrderData;
      const error = validateField(fieldName, formData[fieldName] as string);
      if (error) newErrors[fieldName] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
      return;
    }

    onSubmit({ ...formData }); // shipping_price n'est plus envoyé, seul wilaya_id
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-DZ', {
      style: 'currency',
      currency: 'DZD'
    }).format(price);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">Finaliser votre commande</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={loading}
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Informations personnelles */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">Informations personnelles</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="customer_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nom complet *
                </label>
                <input
                  type="text"
                  id="customer_name"
                  value={formData.customer_name}
                  onChange={(e) => handleInputChange('customer_name', e.target.value)}
                  onBlur={() => handleBlur('customer_name')}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.customer_name ? 'border-red-300' : 'border-gray-300'
                    }`}
                  placeholder="Votre nom complet"
                  disabled={loading}
                />
                {errors.customer_name && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.customer_name}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="customer_phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone *
                </label>
                <input
                  type="tel"
                  id="customer_phone"
                  value={formData.customer_phone}
                  onChange={(e) => handleInputChange('customer_phone', e.target.value)}
                  onBlur={() => handleBlur('customer_phone')}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.customer_phone ? 'border-red-300' : 'border-gray-300'
                    }`}
                  placeholder="+213 6 XX XX XX XX"
                  disabled={loading}
                />
                {errors.customer_phone && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.customer_phone}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Adresse de livraison */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">Adresse de livraison</h4>
            <div className="space-y-4">
              <div>
                <label htmlFor="wilaya_id" className="block text-sm font-medium text-gray-700 mb-1">
                  Wilaya *
                </label>
                <select
                  id="wilaya_id"
                  value={formData.wilaya_id}
                  onChange={e => handleInputChange('wilaya_id', Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={loading || wilayas.length === 0}
                >
                  {wilayas.map(w => (
                    <option key={w.id} value={w.id}>
                      {w.name} ({formatPrice(w.shipping_price)})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="shipping_address" className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse complète *
                </label>
                <textarea
                  id="shipping_address"
                  value={formData.shipping_address}
                  onChange={(e) => handleInputChange('shipping_address', e.target.value)}
                  onBlur={() => handleBlur('shipping_address')}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.shipping_address ? 'border-red-300' : 'border-gray-300'
                    }`}
                  placeholder="Rue, numéro, quartier..."
                  disabled={loading}
                />
                {errors.shipping_address && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.shipping_address}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="shipping_city" className="block text-sm font-medium text-gray-700 mb-1">
                    Ville *
                  </label>
                  <input
                    type="text"
                    id="shipping_city"
                    value={formData.shipping_city}
                    onChange={(e) => handleInputChange('shipping_city', e.target.value)}
                    onBlur={() => handleBlur('shipping_city')}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.shipping_city ? 'border-red-300' : 'border-gray-300'
                      }`}
                    placeholder="Cheraga , ouled fayet ..."
                    disabled={loading}
                  />
                  {errors.shipping_city && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.shipping_city}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="shipping_zip" className="block text-sm font-medium text-gray-700 mb-1">
                    Code postal *
                  </label>
                  <input
                    type="text"
                    id="shipping_zip"
                    value={formData.shipping_zip}
                    onChange={(e) => handleInputChange('shipping_zip', e.target.value)}
                    onBlur={() => handleBlur('shipping_zip')}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.shipping_zip ? 'border-red-300' : 'border-gray-300'
                      }`}
                    placeholder="16000"
                    maxLength={5}
                    disabled={loading}
                  />
                  {errors.shipping_zip && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.shipping_zip}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Résumé de la commande */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Résumé de la commande</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Sous-total</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Livraison :</span>
                <span className="ml-2 text-black font-bold">{formatPrice(shippingPrice)}</span>
              </div>
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-lg font-bold text-green-600">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Boutons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 text-sm font-medium text-white bg-black border border-transparent rounded-md hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Traitement...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Confirmer la commande
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutModal; 