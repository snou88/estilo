import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import model from '../assets/images/products/model.png';

gsap.registerPlugin(ScrollTrigger);

const AboutUs = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const qualityRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animation du logo ESTILO avec GSAP
    const logo = document.querySelector('.hero-image');
    if (logo) {
      gsap.fromTo(
        logo,
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.8,
          ease: 'back.out(1.7)'
        }
      );
    }

    // Animation des points de qualité
    const qualityPoints = document.querySelectorAll('.quality-content .flex');
    qualityPoints.forEach((point, index) => {
      gsap.from(point, {
        opacity: 0,
        y: 20,
        duration: 0.5,
        delay: index * 0.2,
        ease: 'power2.out'
      });
    });

    // Animation de l'image de qualité
    gsap.from('.quality-image', {
      opacity: 0,
      x: -50,
      duration: 0.8,
      ease: 'power4.out'
    });

    // Animations des cartes de valeurs
    gsap.from('.value-card', {
      opacity: 0,
      y: 50,
      duration: 0.6,
      ease: 'power4.out',
      stagger: 0.1
    });

    // Animation des icônes de valeurs
    const valueIcons = document.querySelectorAll('.value-card div:first-child');
    valueIcons.forEach(icon => {
      gsap.from(icon, {
        opacity: 0,
        scale: 0.5,
        duration: 0.6,
        ease: 'back.out(1.7)'
      });
    });

    // Animation du titre de la section valeurs
    const valuesTitle = document.querySelector('.values-section h2');
    if (valuesTitle) {
      gsap.from(valuesTitle, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power4.out'
      });
    }

    // Animation du bouton "Découvrir Notre Collection"
    const button = document.querySelector('.quality-content a');
    if (button) {
      gsap.from(button, {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: 'power2.out'
      });
    }

    // Animation parallaxe simple
    gsap.to('.parallax-bg', {
      y: -100,
      scrollTrigger: {
        trigger: parallaxRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });

    return () => {
      // Nettoyage des animations GSAP
      gsap.killTweensOf('.hero-image');
      gsap.killTweensOf('.quality-content');
      gsap.killTweensOf('.quality-image');
      gsap.killTweensOf('.parallax-bg');
      gsap.killTweensOf('.value-card');
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div ref={heroRef} className="hero-section relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto pt-16 pb-20 sm:pt-24 sm:pb-32 lg:pb-40">
          <div className="relative">
            <div className="mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:px-8">
              <div className="sm:text-center">
                <h1 className="text-6xl tracking-tight font-extrabold gradient-text sm:text-7xl md:text-8xl">
                  <span className="block">ESTILO</span>
                  <span className="block">L'Élégance French Touch</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl animate-float">
                  Depuis 2010, ESTILO est synonyme d'excellence en matière de mode française. 
                  Nous combinons tradition et innovation pour créer des pièces uniques qui transcendent les tendances.
                </p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
              <img
                className="h-56 w-full object-cover sm:h-72 md:h-96 lg:absolute lg:left-0 lg:h-full lg:w-full animate-zoom-in"
                src={model}
                alt="Logo ESTILO"
              />
            </div>
          </div>
        </div>

        {/* Quality Section */}
        <div ref={qualityRef} className="quality-section relative bg-white py-16 sm:py-24 lg:py-32">
          <div className="lg:mx-auto lg:max-w-7xl lg:px-8">
            <div className="relative z-10 mx-auto max-w-lg px-4 sm:max-w-3xl sm:px-6 lg:max-w-none lg:px-0">
              <div className="mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:max-w-none lg:px-0">
                <div className="lg:grid lg:grid-cols-2 lg:gap-8">
                  <div className="relative mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:px-0 lg:max-w-none">
                    <div className="lg:pr-8">
                      <div className="lg:max-w-lg">
                        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                          <span className="block">La Qualité</span>
                          <span className="block text-blue-600">Raison de Notre Être</span>
                        </h2>
                        <p className="mt-4 text-lg text-gray-500 animate-fade-in">
                          Chaque pièce ESTILO est conçue avec un souci du détail exemplaire. 
                          Nos artisans français sélectionnent les meilleurs matériaux et appliquent des techniques ancestrales pour créer des vêtements qui durent.
                        </p>
                        <ul className="mt-6 space-y-6">
                          <li className="flex">
                            <div className="flex-shrink-0">
                              <svg className="h-6 w-6 text-blue-600 animate-rotate" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <p className="ml-3 text-base text-gray-500">
                              Matériaux Premium 100% Made in France
                            </p>
                          </li>
                          <li className="flex">
                            <div className="flex-shrink-0">
                              <svg className="h-6 w-6 text-blue-600 animate-rotate" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <p className="ml-3 text-base text-gray-500">
                              Contrôle Qualité Rigoureux
                            </p>
                          </li>
                          <li className="flex">
                            <div className="flex-shrink-0">
                              <svg className="h-6 w-6 text-blue-600 animate-rotate" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <p className="ml-3 text-base text-gray-500">
                              Garantie de Satisfaction
                            </p>
                          </li>
                        </ul>
                        <div className="mt-8">
                          <div className="inline-flex rounded-md shadow">
                            <a href="products" className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-5 py-3 text-base font-medium text-white hover:bg-blue-700">
                              Découvrir Notre Collection
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-12 sm:mt-16 lg:mt-0">
                    <div className="pl-4 -mr-48 sm:pl-6 md:-mr-16 lg:px-0 lg:m-0 lg:relative lg:h-full">
                      <img
                        className="w-full rounded-md shadow-xl ring-1 ring-black ring-opacity-5 lg:absolute lg:left-0 lg:h-full lg:w-auto lg:max-w-none animate-zoom-in"
                        src={model}
                        alt="Qualité ESTILO"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Parallax Section */}
        <div ref={parallaxRef} className="parallax-section relative bg-white overflow-hidden">
          <div className="absolute inset-0">
            <img
              className="w-full h-full object-cover parallax-bg"
              src={model}
              alt="Background"
            />
            <div className="absolute inset-0 bg-gray-900 mix-blend-multiply" aria-hidden="true" />
          </div>
          <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl animate-fade-in">
                <span className="block">L'Excellence</span>
                <span className="block text-blue-400">à Chaque Étape</span>
              </h2>
              <p className="mx-auto mt-3 max-w-md text-base text-white sm:text-lg md:mt-5 md:max-w-3xl animate-fade-in">
                De la sélection des matériaux à la livraison, chaque étape est menée avec la plus grande attention.
              </p>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div ref={valuesRef} className="values-section bg-gray-50">
          <div className="max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl animate-fade-in">
                Nos Valeurs
              </h2>
              <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl animate-fade-in">
                Les principes qui définissent notre identité
              </p>
            </div>
            <div className="mt-12">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                <div className="bg-white p-6 rounded-lg shadow value-card">
                  <div className="text-3xl font-bold text-blue-600 mb-4">✨</div>
                  <h3 className="text-lg font-medium text-gray-900">Excellence</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Nous ne transigeons pas sur la qualité, de la conception à la livraison.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow value-card">
                  <div className="text-3xl font-bold text-blue-600 mb-4">🎨</div>
                  <h3 className="text-lg font-medium text-gray-900">Créativité</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Notre équipe de designers innove constamment pour créer des pièces uniques.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow value-card">
                  <div className="text-3xl font-bold text-blue-600 mb-4">🌍</div>
                  <h3 className="text-lg font-medium text-gray-900">Engagement</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Nous nous engageons pour un mode de production durable et éthique.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;