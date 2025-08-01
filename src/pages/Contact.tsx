import React, { useEffect, useRef } from 'react';
import { Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';
import '../styles/contact-animations.css';

const Contact = () => {
  const leftCardRef = useRef<HTMLDivElement>(null);
  const rightCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => {
      leftCardRef.current?.classList.add('slide-in-left');
      rightCardRef.current?.classList.add('slide-in-right');
    }, 200);
  }, []);

  return (
    <div className="min-h-screen py-20 bg-gradient-to-br from-white via-gray-50 to-gray-200 flex flex-col justify-center items-center">
      <h1 className="text-5xl font-bold text-gray-900 mb-12 tracking-tight text-center">Contactez-nous</h1>
      <div className="flex flex-col md:flex-row gap-10 w-full max-w-5xl justify-center items-stretch">
        {/* Carte Formulaire */}
        <div
          ref={leftCardRef}
          className="contact-card bg-white shadow-2xl rounded-3xl p-8 flex-1 max-w-md flex flex-col justify-between border border-gray-100"
          style={{ minWidth: 320 }}
        >
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Envoyez-nous un message</h2>
          <form className="flex flex-col gap-5">
            <input
              type="text"
              placeholder="Votre nom"
              className="px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              required
            />
            <input
              type="email"
              placeholder="Votre email"
              className="px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              required
            />
            <textarea
              placeholder="Votre message"
              rows={5}
              className="px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              required
            />
            <button
              type="submit"
              className="mt-2 py-3 rounded-lg bg-black text-white font-semibold text-lg shadow-md hover:bg-gray-800 transition"
            >
              Envoyer
            </button>
          </form>
        </div>
        {/* Carte Infos */}
        <div
          ref={rightCardRef}
          className="contact-card bg-white shadow-2xl rounded-3xl p-8 flex-1 max-w-md flex flex-col justify-between border border-gray-100"
          style={{ minWidth: 320 }}
        >
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Nos coordonnées</h2>
          <div className="flex flex-col gap-4 text-gray-700 text-lg">
            <div>
              <span className="font-medium">Adresse :</span> 123 Avenue de la Mode, Paris
            </div>
            <div>
              <span className="font-medium">Téléphone :</span> <a href="tel:+33123456789" className="text-black hover:underline">01 23 45 67 89</a>
            </div>
            <div>
              <span className="font-medium">Email :</span> <a href="mailto:contact@estilo.fr" className="text-black hover:underline">contact@estilo.fr</a>
            </div>
            <div className="flex gap-6 mt-6 mb-6 justify-center">
              <a href="#" className="text-gray-400 hover:text-black transition" aria-label="Facebook">
                <Facebook className="h-7 w-7" />
              </a>
              <a href="#" className="text-gray-400 hover:text-black transition" aria-label="Instagram">
                <Instagram className="h-7 w-7" />
              </a>
              <a href="#" className="text-gray-400 hover:text-black transition" aria-label="Twitter">
                <Twitter className="h-7 w-7" />
              </a>
              <a href="#" className="text-gray-400 hover:text-black transition" aria-label="LinkedIn">
                <Linkedin className="h-7 w-7" />
              </a>
            </div>
            <div className="w-full h-56 rounded-xl overflow-hidden shadow mt-2">
              <iframe
                title="Google Maps"
                src="https://www.google.com/maps?q=48.8566,2.3522&z=15&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;