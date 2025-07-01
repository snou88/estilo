# Estilo E-commerce

Site e-commerce moderne pour la marque de vêtements Estilo, développé avec React, TypeScript, Tailwind CSS pour le frontend et PHP/MySQL pour le backend.

## 🚀 Fonctionnalités

### Frontend (React + TypeScript)
- ✅ Page d'accueil avec hero section et produits vedettes
- ✅ Navigation responsive avec menu mobile
- ✅ Design professionnel noir/blanc
- ✅ Animations et micro-interactions
- ✅ Structure modulaire et composants réutilisables
- 🔄 Pages produits (en développement)
- 🔄 Système de panier (en développement)
- 🔄 Authentification utilisateur (en développement)

### Backend (PHP + MySQL)
- ✅ Structure API REST
- ✅ Modèles pour produits et utilisateurs
- ✅ Configuration base de données
- ✅ Schéma complet de la base de données
- 🔄 Endpoints API complets (en développement)
- 🔄 Système d'authentification (en développement)
- 🔄 Gestion des commandes (en développement)

## 📁 Structure du Projet

```
estilo-ecommerce/
├── src/                          # Frontend React
│   ├── components/               # Composants réutilisables
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── pages/                    # Pages de l'application
│   │   ├── Home.tsx             # ✅ Page d'accueil complète
│   │   ├── Products.tsx         # 🔄 En développement
│   │   ├── AboutUs.tsx          # 🔄 En développement
│   │   ├── FAQ.tsx              # 🔄 En développement
│   │   └── Contact.tsx          # 🔄 En développement
│   ├── hooks/                    # Hooks personnalisés
│   │   └── useCart.ts
│   ├── context/                  # Contextes React
│   │   └── CartContext.tsx
│   ├── types/                    # Types TypeScript
│   │   └── index.ts
│   └── utils/                    # Utilitaires
│       └── api.ts
├── backend/                      # Backend PHP
│   ├── config/                   # Configuration
│   │   └── database.php
│   ├── models/                   # Modèles de données
│   │   ├── Product.php
│   │   └── User.php
│   └── api/                      # Endpoints API
│       └── products/
│           ├── read.php
│           └── read_one.php
├── database/                     # Base de données
│   └── schema.sql               # Schéma complet MySQL
└── public/
    └── estilo.svg               # Logo de la marque
```

## 🎨 Design

- **Couleurs** : Noir pour le texte, blanc pour les arrière-plans
- **Typographie** : Police moderne avec différents poids
- **Style** : Design minimaliste et élégant
- **Responsive** : Optimisé pour mobile, tablette et desktop
- **Animations** : Transitions fluides et micro-interactions

## 🛠 Technologies

### Frontend
- React 18 avec TypeScript
- Tailwind CSS pour le styling
- React Router pour la navigation
- Lucide React pour les icônes
- Vite comme bundler

### Backend
- PHP 8+ avec PDO
- MySQL pour la base de données
- Architecture REST API
- Gestion des sessions et authentification

## 📦 Installation

### Prérequis
- Node.js 18+
- PHP 8+
- MySQL 8+
- Serveur web (Apache/Nginx)

### Frontend
```bash
npm install
npm run dev
```

### Backend
1. Configurer la base de données dans `backend/config/database.php`
2. Importer le schéma : `mysql -u root -p < database/schema.sql`
3. Configurer le serveur web pour pointer vers le dossier `backend/`

## 🚧 Prochaines Étapes

1. **Page Produits** : Catalogue complet avec filtres et recherche
2. **Système de Panier** : Ajout/suppression de produits, calcul des totaux
3. **Authentification** : Inscription, connexion, profil utilisateur
4. **Commandes** : Processus de commande et paiement
5. **Administration** : Interface d'administration pour gérer les produits
6. **Optimisations** : SEO, performance, tests

## 📝 Notes de Développement

- Le logo Estilo est intégré et stylisé en noir
- Les images utilisent Pexels pour les photos de stock
- La structure est prête pour l'intégration backend
- Le design suit les principes UX/UI modernes
- Code modulaire et maintenable

## 🤝 Contribution

Ce projet suit une architecture modulaire pour faciliter le développement collaboratif. Chaque composant est indépendant et réutilisable.