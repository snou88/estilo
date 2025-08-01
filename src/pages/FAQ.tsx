import React, { useRef, useEffect, useState } from 'react';
import { ChevronDown, HelpCircle, Truck, RefreshCw, CreditCard } from 'lucide-react';
import '../styles/faq-animations.css';

const faqs = [
  {
    question: 'Comment passer une commande sur Estilo ?',
    answer: 'Pour passer une commande, il vous suffit de parcourir notre catalogue, d’ajouter les articles souhaités à votre panier, puis de suivre les instructions de paiement. Un email de confirmation vous sera envoyé.',
    icon: <HelpCircle className="h-6 w-6 text-black" />,
  },
  {
    question: 'Quels sont les délais de livraison ?',
    answer: 'La livraison standard est généralement effectuée sous 2 à 5 jours ouvrés. Vous recevrez un numéro de suivi dès l’expédition de votre commande.',
    icon: <Truck className="h-6 w-6 text-black" />,
  },
  {
    question: 'Puis-je retourner un article ?',
    answer: 'Oui, vous disposez de 14 jours après réception pour retourner un article non porté. Consultez notre page Retours pour plus de détails.',
    icon: <RefreshCw className="h-6 w-6 text-black" />,
  },
  {
    question: 'Quels moyens de paiement acceptez-vous ?',
    answer: 'Nous acceptons les paiements par carte bancaire (Visa, Mastercard), PayPal et Apple Pay.',
    icon: <CreditCard className="h-6 w-6 text-black" />,
  },
];

const FAQ = () => {
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [visibleIndexes, setVisibleIndexes] = useState<number[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      itemsRef.current.forEach((el, idx) => {
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight - 80) {
            setVisibleIndexes((prev) => (prev.includes(idx) ? prev : [...prev, idx]));
          }
        }
      });
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen py-20 bg-gradient-to-br from-white via-gray-50 to-gray-200 flex flex-col items-center">
      <div className="max-w-2xl w-full px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">Foire aux Questions</h1>
          <p className="text-lg text-gray-600">Vous avez une question&nbsp;? Retrouvez ici les réponses aux interrogations les plus fréquentes sur Estilo.</p>
        </div>
        <div className="space-y-6">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              ref={el => itemsRef.current[idx] = el}
              className={`faq-fade-in transition-all duration-700 ${visibleIndexes.includes(idx) ? 'visible' : ''}`}
            >
              <div
                className={`flex items-center bg-white shadow-lg rounded-2xl px-6 py-5 cursor-pointer select-none transition border border-gray-100 hover:shadow-xl ${openIndex === idx ? 'ring-2 ring-indigo-400' : ''}`}
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              >
                <span className="mr-4">
                  {faq.icon}
                </span>
                <span className="flex-1 text-lg font-medium text-gray-900">{faq.question}</span>
                <ChevronDown className={`h-6 w-6 text-gray-400 transition-transform duration-300 ${openIndex === idx ? 'rotate-180' : ''}`} />
              </div>
              <div
                className={`overflow-hidden transition-all duration-500 bg-white rounded-b-2xl px-6 ${openIndex === idx ? 'max-h-40 py-4 opacity-100' : 'max-h-0 py-0 opacity-0'}`}
                style={{ boxShadow: openIndex === idx ? '0 2px 24px rgba(0,0,0,0.06)' : 'none' }}
              >
                <p className="text-gray-700 text-base leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;