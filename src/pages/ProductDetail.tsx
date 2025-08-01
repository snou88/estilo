import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Truck, Shield, RefreshCw, Star, ArrowLeft, ArrowRight } from 'lucide-react';


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
    fetch(`http://localhost/estilo/api/products/read_one.php?id=${id}`)
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
    <div className="min-h-screen py-12 px-4 bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-8 flex flex-col md:flex-row gap-10 relative overflow-hidden">
        {/* Badges */}
        <div className="absolute left-[70px] top-0 flex gap-2 p-2 z-10">
          {product.badges.map((badge, i) => (
            <span key={i} className="bg-black text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-bounce">
              {badge}
            </span>
          ))}
        </div>

        {/* Images & colors with arrows */}
        <div className="flex-1 flex flex-col items-center relative">
          <div className="relative w-full max-w-xs h-64 sm:h-80 md:w-80 md:h-80 mb-4 rounded-xl overflow-hidden shadow-lg border-4 border-blue-100">
            {filteredImages.map((img, idx) => (
              <img
                key={idx}
                src={img.image_path}
                alt={product.name}
                className={`w-full h-full object-cover transition-opacity duration-500 absolute inset-0 ${idx === currentIdx ? 'opacity-100' : 'opacity-0'}`}
              />
            ))}
          </div>
          <div className="flex gap-3 mt-2">
            {product.colors.map(c => (
              <button
                key={c}
                className={`w-8 h-8 rounded-full border-2 ${color === c ? 'border-black ring-2 ring-black' : 'border-gray-300'}`}
                style={{ background: c }}
                onClick={() => setColor(c)}
                aria-label={c}
              />
            ))}
          </div>
        </div>

        {/* Product info */}
        <div className="flex-1 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-2 text-black flex items-center gap-2">
            {product.name}
          </h2>
          <p className="text-gray-600 mb-4 text-lg">{product.description}</p>

          {/* Size selector */}
          <div className="flex flex-col gap-2 mb-4">
            <span className="font-medium">
              {product.sizes.length > 0 ? (
                <div className="flex gap-4">
                  Taille :
                  {product.sizes.map(s => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={`px-3 py-1 rounded border ${size === s ? 'bg-black text-white' : 'bg-white text-black border-black'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              ) : (
                <> Taille : Standard </>
              )}</span>
          </div>

          {/* Quantity selector */}
          <div className="flex gap-4 mb-4 items-center">
            <span className="font-medium">Quantité :</span>
            <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-2 py-1 bg-gray-200 rounded-l hover:bg-blue-100">-</button>
            <input
              type="number" min={1} value={quantity}
              onChange={e => setQuantity(Math.max(1, Number(e.target.value)))}
              className="w-14 text-center border-t border-b border-gray-200"
            />
            <button onClick={() => setQuantity(q => q + 1)} className="px-2 py-1 bg-gray-200 rounded-r hover:bg-blue-100">+</button>
          </div>

          {/* Pricing */}
          <div className="flex items-end gap-4 mb-2">
            <span className="text-2xl font-bold text-black">{product.price} DA</span>
            <span className="text-lg text-gray-400 line-through">{product.oldPrice} DA</span>
          </div>
          <div className="mb-6 text-2xl font-extrabold text-green-600 border-t pt-4">
            Total à payer : {total} DA
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                if (!product || size == "Standard" && product.sizes.length > 0) return setShowPopup(true); // Sécurité supplémentaire
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
              className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all mb-2 ${size
                ? 'bg-gradient-to-r from-black to-black text-white hover:scale-105'
                : 'bg-gray-400 text-white cursor-not-allowed'
                }`}
            >
              Commander maintenant
            </button>
            {/* Popup */}
            {showPopup && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-lg text-center">
                  <h2 className="text-xl font-bold mb-4 text-red-600">Taille non sélectionnée</h2>
                  <p className="mb-6 text-gray-700">Veuillez sélectionner une taille avant de continuer.</p>
                  <button
                    onClick={() => setShowPopup(false)}
                    className="bg-black text-white px-4 py-2 rounded-lg hover:bg-black transition"
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
              className={`w-full border-2 py-4 rounded-xl font-bold text-lg shadow-md transition-all ${size
                ? 'border-black text-black hover:bg-black hover:text-white bg-white'
                : 'border-gray-400 text-gray-400 bg-gray-200 cursor-not-allowed'
                }`}
            >
              Ajouter au panier
            </button>
          </div>

          {/* Guarantees */}
          <div className="flex flex-col items-center justify-center gap-2 my-4 text-gray-600 text-sm md:flex-row md:gap-4">
            <span className="flex items-center gap-1"><Truck className="w-5 h-5" /> Livraison partout en Algérie</span>
            <span className="flex items-center gap-1"><Shield className="w-5 h-5" /> Paiement sécurisé</span>
            <span className="flex items-center gap-1"><RefreshCw className="w-5 h-5" /> Satisfait ou remboursé</span>
          </div>

          <div className="text-center text-gray-500 text-xs mb-2">
            Votre satisfaction est notre priorité. Service client 7j/7.
          </div>

          <Link to="/products" className="block mt-2 text-black hover:underline">
            ← Retour aux produits
          </Link>
        </div>
      </div>

      {/* Testimonials */}
      <div className="max-w-3xl mx-auto mt-10">
        <h3 className="text-xl font-semibold text-center mb-6 text-gray-800">
          Ce que disent nos clients
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Sami B.', text: 'Livraison rapide, produit de qualité, je recommande à 100%!', stars: 5 },
            { name: 'Nadia K.', text: 'Super service client, la veste est magnifique!', stars: 5 },
            { name: 'Yacine A.', text: 'Commande facile et livraison à Alger en 2 jours!', stars: 4 }
          ].map((t, i) => (
            <div key={i} className="bg-white rounded-xl shadow-md p-5 flex flex-col items-center">
              <div className="flex gap-1 mb-2">
                {[...Array(t.stars)].map((_, idx) => <Star key={idx} className="w-5 h-5 text-yellow-400 fill-current" />)}
              </div>
              <div className="italic text-gray-600 text-center mb-2">"{t.text}"</div>
              <div className="font-medium text-black">{t.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
