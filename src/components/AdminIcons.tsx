import { CategoryScale } from 'chart.js';
import { Package, Mail, ShoppingCart, BarChart2, Settings, MapPin, CassetteTapeIcon, } from 'lucide-react';

export const adminIcons = [
  { label: 'Produits', color: '#4e73df', icon: Package, to: '/admin/products' },
  { label: 'categorie-and-size', color: '#4e5523', icon: CassetteTapeIcon, to: '/admin/categorie-and-size' },
  { label: 'Contact', color: '#1cc88a', icon: Mail, to: '/admin/contact' },
  { label: 'Orders', color: '#f59e42', icon: ShoppingCart, to: '/admin/orders' },
  { label: 'Wilayas', color: '#6f42c1', icon: MapPin, to: '/admin/Wilayas' },
  { label: 'Statistiques', color: '#f6c23e', icon: BarChart2, to: '/admin/statistics' },
  { label: 'Paramètres', color: '#e74a3b', icon: Settings, to: '/admin/settings' },
];
