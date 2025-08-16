import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Truck, Shield, RefreshCw, Star, ArrowLeft, ArrowRight } from 'lucide-react';
import { getPhpApiUrl } from '../utils/api';

type Image = {
  image_path: string;
  color: string;
  is_main: 0 | 1;
};

type ApiProduct = {
  id: number;
  name: string;
  description: string;
  price: number;
  oldPrice: number;
  category_id: number;
  category_name: string;
  images: Image[];
  colors: string[];
  sizes: string[];
  deliveryBase: number;
  badges: string[];
};

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { addToCart, updateQuantity } = useCart();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [loading, setLoading] = useState(true);

  const [size, setSize] = useState<string>('Standard');
  const [showPopup, setShowPopup] = useState(false);
  const [color, setColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  // const [wilaya, setWilaya] = useState<string>(wilayas[0]);

  // Track filtered images and current slide index
  const [filteredImages, setFilteredImages] = useState<Image[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);

  // Compute total
  const total = (product?.price ?? 0) * quantity;

  // Fetch product data
  useEffect(() => {
    if (!id) return;
    fetch(getPhpApiUrl(`api/products/read_one.php?id=${id}`))
      .then(res => res.json())
      .then((data: ApiProduct) => {
        setProduct(data);
        if (data.colors.length) setColor(data.colors[0]);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  // Update images when product/color change
  useEffect(() => {
    if (!product) return;
    const imgs = product.images.filter(img => img.color === color);
    setFilteredImages(imgs.length ? imgs : product.images);
    setCurrentIdx(0);
  }, [product, color]);

  const prevSlide = () =>
    setCurrentIdx(i => (i === 0 ? filteredImages.length - 1 : i - 1));
  const nextSlide = () =>
    setCurrentIdx(i => (i === filteredImages.length - 1 ? 0 : i + 1));

  if (loading) return <div className="text-center py-20">Chargement…</div>;
  if (!product) return <div className="text-center py-20">Produit introuvable.</div>;

  return (
    <div className="min-h-screen py-6 sm:py-12 px-2 sm:px-4 bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 flex flex-col md:flex-row gap-6 sm:gap-8 relative overflow-hidden">
        {/* Badges */}
        <div className="absolute left-4 sm:left-8 top-2 sm:top-4 flex gap-1 sm:gap-2 z-10 ml-16">
          {product.badges.map((badge, i) => (
            <span key={i} className="bg-black text-white text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-lg animate-bounce">
              {badge}
            </span>
          ))}
        </div>

        {/* Images & colors with arrows */}
        <div className="flex-1 flex flex-col items-center relative w-full mt-1">
          <div className="relative w-full max-w-xs h-64 sm:h-64 md:h-96 mb-3 sm:mb-4 rounded-xl overflow-hidden border-2 border-blue-100 mt-5">
            {filteredImages.map((img, idx) => (
              <img
                key={idx}
                src={img.image_path}
                alt={product.name}
                className={`w-full h-full object-cover transition-opacity duration-500 absolute inset-0 ${idx === currentIdx ? 'opacity-100' : 'opacity-0'}`}
              />
            ))}
            {filteredImages.length > 1 && (
              <>
                <button 
                  onClick={prevSlide}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow-md"
                  aria-label="Image précédente"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={nextSlide}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow-md"
                  aria-label="Image suivante"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
          <div className="flex gap-2 mt-2 flex-wrap justify-center">
            {product.colors.map(c => (
              <button
                key={c}
                className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 ${color === c ? 'border-black ring-2 ring-black' : 'border-gray-300'}`}
                style={{ background: c }}
                onClick={() => setColor(c)}
                aria-label={c}
              />
            ))}
          </div>
        </div>

        {/* Product info */}
        <div className="flex-1 flex flex-col justify-center mt-4 sm:mt-0">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-black">
            {product.name}
          </h2>
          <p className="text-gray-600 mb-4 text-base sm:text-lg">{product.description}</p>

          {/* Size selector */}
          <div className="flex flex-col gap-2 mb-4">
            <span className="font-medium text-sm sm:text-base">
              {product.sizes.length > 0 ? (
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <span className="whitespace-nowrap">Taille :</span>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map(s => (
                      <button
                        key={s}
                        onClick={() => setSize(s)}
                        className={`px-2 py-1 text-sm sm:text-base rounded border ${size === s ? 'bg-black text-white' : 'bg-white text-black border-black'}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <> Taille : Standard </>
              )}</span>
          </div>

          {/* Quantity selector */}
          <div className="flex items-center gap-3 mb-4">
            <span className="font-medium text-sm sm:text-base">Quantité :</span>
            <div className="flex">
              <button 
                onClick={() => setQuantity(q => Math.max(1, q - 1))} 
                className="px-2 sm:px-3 py-1 bg-gray-200 rounded-l hover:bg-blue-100 text-sm sm:text-base"
                aria-label="Réduire la quantité"
              >-</button>
              <input
                type="number" 
                min={1} 
                value={quantity}
                onChange={e => setQuantity(Math.max(1, Number(e.target.value)))}
                className="w-10 sm:w-14 text-center border-t border-b border-gray-200 text-sm sm:text-base"
                aria-label="Quantité"
              />
              <button 
                onClick={() => setQuantity(q => q + 1)} 
                className="px-2 sm:px-3 py-1 bg-gray-200 rounded-r hover:bg-blue-100 text-sm sm:text-base"
                aria-label="Augmenter la quantité"
              >+</button>
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-end gap-3 sm:gap-4 mb-2">
            <span className="text-xl sm:text-2xl font-bold text-black">{product.price} DA</span>
            {product.oldPrice && (
              <span className="text-base sm:text-lg text-gray-400 line-through">{product.oldPrice} DA</span>
            )}
          </div>
          <div className="mb-4 sm:mb-6 text-xl sm:text-2xl font-extrabold text-green-600 border-t pt-3 sm:pt-4">
            Total : {total} DA
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                if (!product || size == "Standard" && product.sizes.length > 0) return setShowPopup(true);
                addToCart({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  color: color,
                  size: size,
                  image: product.images[0]?.image_path || ''
                });
                updateQuantity(product.id, color, size, quantity);
                navigate('/cart');
              }}
              disabled={!size}
              className={`w-full py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg shadow-lg transition-all ${
                size
                  ? 'bg-gradient-to-r from-black to-black text-white hover:scale-105'
                  : 'bg-gray-400 text-white cursor-not-allowed'
              }`}
              aria-label="Commander maintenant"
            >
              Commander maintenant
            </button>

            {/* Popup */}
            {showPopup && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
                <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-lg text-center">
                  <h2 className="text-xl font-bold mb-4 text-red-600">Taille non sélectionnée</h2>
                  <p className="mb-6 text-gray-700">Veuillez sélectionner une taille avant de continuer.</p>
                  <button
                    onClick={() => setShowPopup(false)}
                    className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
                    aria-label="Fermer"
                  >
                    OK
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={() => {
                if (!product || size == "Standard" && product.sizes.length > 0) return setShowPopup(true);
                addToCart({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  color: color,
                  size: size,
                  image: product.images[0]?.image_path || ''
                });
                updateQuantity(product.id, color, size, quantity);
              }}
              disabled={!size}
              className={`w-full border-2 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg shadow-md transition-all ${
                size
                  ? 'border-black text-black hover:bg-black hover:text-white bg-white'
                  : 'border-gray-400 text-gray-400 bg-gray-200 cursor-not-allowed'
              }`}
              aria-label="Ajouter au panier"
            >
              Ajouter au panier
            </button>
          </div>

          {/* Guarantees */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 my-4 text-gray-600 text-xs sm:text-sm">
            <span className="flex items-center gap-1"><Truck className="w-4 h-4 sm:w-5 sm:h-5" /> Livraison partout en Algérie</span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1"><Shield className="w-4 h-4 sm:w-5 sm:h-5" /> Paiement sécurisé</span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1"><RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" /> Satisfait ou remboursé</span>
          </div>

          <div className="text-center text-gray-500 text-xs mb-2">
            Votre satisfaction est notre priorité. Service client 7j/7.
          </div>

          <Link 
            to="/products" 
            className="block mt-2 text-black hover:underline text-sm sm:text-base flex items-center justify-center sm:justify-start gap-1"
          >
            <ArrowLeft className="w-4 h-4" /> Retour aux produits
          </Link>
        </div>
      </div>

      {/* Testimonials */}
      <div className="max-w-3xl mx-auto mt-8 sm:mt-10 px-2">
        <h3 className="text-lg sm:text-xl font-semibold text-center mb-4 sm:mb-6 text-gray-800">
          Ce que disent nos clients
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {[
            { name: 'Sami B.', text: 'Livraison rapide, produit de qualité, je recommande à 100%!', stars: 5 },
            { name: 'Nadia K.', text: 'Super service client, la veste est magnifique!', stars: 5 },
            { name: 'Yacine A.', text: 'Commande facile et livraison à Alger en 2 jours!', stars: 4 }
          ].map((t, i) => (
            <div key={i} className="bg-white rounded-xl shadow-md p-4 sm:p-5 flex flex-col items-center">
              <div className="flex gap-1 mb-2">
                {[...Array(t.stars)].map((_, idx) => (
                  <Star key={idx} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <div className="italic text-sm sm:text-base text-gray-600 text-center mb-2">"{t.text}"</div>
              <div className="font-medium text-sm sm:text-base text-black">{t.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
