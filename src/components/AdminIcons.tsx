import { Package, Mail, ShoppingCart, BarChart2, Settings } from 'lucide-react';

export const adminIcons = [
  { label: 'Produits', color: '#4e73df', icon: Package, to: '/admin/products' },
  { label: 'Contact', color: '#1cc88a', icon: Mail, to: '/admin/contact' },
  { label: 'Commandes', color: '#f59e42', icon: ShoppingCart, to: '/admin/orders' },
  { label: 'Statistiques', color: '#f6c23e', icon: BarChart2, to: '/admin/statistics' },
  { label: 'Paramètres', color: '#e74a3b', icon: Settings, to: '/admin/settings' },
];
