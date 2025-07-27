import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Truck, Shield, RefreshCw } from 'lucide-react';

const Home = () => {
  const featuredProducts = [
    {
      id: 1,
      name: 'Veste Élégante',
      price: '8900 DA',
      image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'Vestes'
    },
    {
      id: 2,
      name: 'Robe Moderne',
      price: '6500 DA',
      image: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'Robes'
    },
    {
      id: 3,
      name: 'Chemise Classique',
      price: '4500 DA',
      image: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'Chemises'
    },
    {
      id: 4,
      name: 'Pantalon Tendance',
      price: '7500 DA',
      image: 'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'Pantalons'
    }
  ];

  const features = [
    {
      icon: Truck,
      title: 'Livraison Gratuite',
      description: 'Livraison gratuite pour toute commande supérieure à 50€'
    },
    {
      icon: Shield,
      title: 'Paiement Sécurisé',
      description: 'Vos transactions sont protégées par un cryptage SSL'
    },
    {
      icon: RefreshCw,
      title: 'Retour Facile',
      description: 'Retour gratuit sous 30 jours, sans condition'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="absolute inset-0 bg-black/5"></div>
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-light text-black mb-6 tracking-tight">
            Style. Élégance. 
            <span className="block font-normal">Estilo.</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Découvrez notre collection exclusive de vêtements qui allient 
            sophistication moderne et confort exceptionnel.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="bg-black text-white px-8 py-4 text-lg font-medium hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 flex items-center justify-center group"
            >
              Découvrir la Collection
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/about"
              className="border-2 border-black text-black px-8 py-4 text-lg font-medium hover:bg-black hover:text-white transition-all duration-300"
            >
              Notre Histoire
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-black mb-4">
              Produits Vedettes
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Sélection de nos pièces les plus appréciées, 
              conçues pour sublimer votre style unique.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
              >
                <div className="relative overflow-hidden bg-gray-100 aspect-[3/4] mb-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-1">{product.category}</p>
                  <h3 className="text-lg font-medium text-black mb-2">{product.name}</h3>
                  <p className="text-xl font-semibold text-black">{product.price}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/products"
              className="inline-flex items-center text-black font-medium hover:text-gray-600 transition-colors group"
            >
              Voir tous les produits
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-black text-white rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-black mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-light mb-4">Restez Informé</h2>
          <p className="text-xl text-gray-300 mb-8">
            Inscrivez-vous à notre newsletter pour découvrir en avant-première 
            nos nouvelles collections et offres exclusives.
          </p>
          <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-4">
            <input
              type="email"
              placeholder="Votre adresse email"
              className="flex-1 px-6 py-3 text-black rounded-none focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="bg-white text-black px-8 py-3 font-medium hover:bg-gray-100 transition-colors">
              S'inscrire
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-black mb-4">
              Ce que disent nos clients
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center p-6">
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, index) => (
                    <Star key={index} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic leading-relaxed">
                  "Qualité exceptionnelle et style intemporel. 
                  Estilo a transformé ma garde-robe avec des pièces 
                  qui me correspondent parfaitement."
                </p>
                <div className="font-medium text-black">Marie L.</div>
                <div className="text-sm text-gray-500">Cliente fidèle</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;