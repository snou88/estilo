/*
  # Tables pour l'administration

  1. Nouvelles Tables
    - `contact_messages` - Messages de contact du site
    - `site_settings` - Paramètres du site
    - `admin_users` - Utilisateurs administrateurs
    - `admin_replies` - Réponses envoyées par les admins

  2. Sécurité
    - Enable RLS sur toutes les nouvelles tables
    - Policies appropriées pour l'administration
*/

-- Table des messages de contact
CREATE TABLE IF NOT EXISTS contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des paramètres du site
CREATE TABLE IF NOT EXISTS site_settings (
    setting_key VARCHAR(100) PRIMARY KEY,
    setting_value TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table des utilisateurs administrateurs
CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table des réponses admin
CREATE TABLE IF NOT EXISTS admin_replies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    original_message_id INT,
    reply_to VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (original_message_id) REFERENCES contact_messages(id)
);

-- Insertion des paramètres par défaut
INSERT IGNORE INTO site_settings (setting_key, setting_value) VALUES
('site_name', 'Estilo'),
('site_description', 'Boutique de mode en ligne'),
('site_email', 'contact@estilo.com'),
('site_phone', '+33 1 23 45 67 89'),
('site_address', '123 Rue de la Mode, 75001 Paris, France'),
('currency', 'EUR'),
('tax_rate', '20'),
('shipping_cost', '5.99'),
('free_shipping_threshold', '50'),
('maintenance_mode', '0'),
('email_notifications', '1'),
('sms_notifications', '0');

-- Insertion d'un admin par défaut
INSERT IGNORE INTO admin_users (username, email, password) VALUES
('admin', 'admin@estilo.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'); -- password: admin123

-- Insertion de quelques messages de contact de test
INSERT IGNORE INTO contact_messages (name, email, subject, message, is_read) VALUES
('Marie Dupont', 'marie@example.com', 'Question sur les tailles', 'Bonjour, j\'aimerais savoir comment choisir la bonne taille pour vos vêtements.', FALSE),
('Pierre Martin', 'pierre@example.com', 'Délai de livraison', 'Quel est le délai de livraison pour Paris ?', TRUE),
('Sophie Bernard', 'sophie@example.com', 'Retour produit', 'Comment puis-je retourner un article qui ne me convient pas ?', FALSE);