import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo et Description */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center mb-4">
              <img 
                src="/estilo.svg" 
                alt="Estilo" 
                className="h-8 w-auto"
              />
            </Link>
            <p className="text-gray-600 text-sm mb-4 max-w-md">
              Estilo vous propose une collection unique de vêtements tendance 
              alliant style, qualité et confort pour exprimer votre personnalité.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-black transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-black transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-black transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold text-black uppercase tracking-wider mb-4">
              Navigation
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-black transition-colors text-sm">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-600 hover:text-black transition-colors text-sm">
                  Produits
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-black transition-colors text-sm">
                  À Propos
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-600 hover:text-black transition-colors text-sm">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-black transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-black uppercase tracking-wider mb-4">
              Contact
            </h3>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-600 text-sm">
                <Mail className="h-4 w-4 mr-2" />
                contact@estilo.com
              </li>
              <li className="flex items-center text-gray-600 text-sm">
                <Phone className="h-4 w-4 mr-2" />
                +33 1 23 45 67 89
              </li>
              <li className="flex items-start text-gray-600 text-sm">
                <MapPin className="h-4 w-4 mr-2 mt-0.5" />
                123 Rue de la Mode<br />75001 Paris, France
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm">
              © 2024 Estilo. Tous droits réservés.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-600 hover:text-black transition-colors text-sm">
                Politique de confidentialité
              </a>
              <a href="#" className="text-gray-600 hover:text-black transition-colors text-sm">
                Conditions d'utilisation
              </a>
              <a href="#" className="text-gray-600 hover:text-black transition-colors text-sm">
                Mentions légales
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;