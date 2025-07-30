-- Création de la base de données
CREATE DATABASE IF NOT EXISTS estilo_ecommerce;
USE estilo_ecommerce;

-- Table des administrateurs
CREATE TABLE admins (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

ALTER TABLE `admins`
ADD `token` VARCHAR(255) NOT NULL;


-- Table des catégories
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des produits
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category_id INT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Table des images de produits
CREATE TABLE product_images (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT,
    image_path VARCHAR(255) NOT NULL,
    color VARCHAR(50),
    is_main BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Table des commandes
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    shipping_address TEXT NOT NULL,
    shipping_city VARCHAR(100) NOT NULL,
    shipping_zip VARCHAR(20) NOT NULL,
    shipping_price DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'accepted', 'cancelled', 'delivered') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

ALTER TABLE orders DROP COLUMN shipping_wilaya;
ALTER TABLE orders ADD COLUMN wilaya_id INT NOT NULL AFTER shipping_zip;
ALTER TABLE orders ADD CONSTRAINT fk_wilaya FOREIGN KEY (wilaya_id) REFERENCES wilayas(id);


-- Table des items de commande
CREATE TABLE order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT,
    product_id INT,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

ALTER TABLE order_items ADD COLUMN size VARCHAR(20) DEFAULT NULL AFTER product_id;

-- Table des avis
CREATE TABLE reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT,
    customer_name VARCHAR(100) NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Table des messages de contact
CREATE TABLE contact_messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('unread', 'read', 'replied') DEFAULT 'unread',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE sizes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL
);

ALTER TABLE sizes
ADD COLUMN category_id INT,
ADD CONSTRAINT fk_category
FOREIGN KEY (category_id) REFERENCES categories(id);

CREATE TABLE wilayas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    shipping_price DECIMAL(10,2) NOT NULL
);

INSERT INTO wilayas (name, shipping_price) VALUES
('Adrar', 700.00),
('Chlef', 700.00),
('Laghouat', 700.00),
('Oum El Bouaghi', 700.00),
('Batna', 700.00),
('Béjaïa', 700.00),
('Biskra', 700.00),
('Béchar', 700.00),
('Blida', 600.00),
('Bouira', 600.00),
('Tamanrasset', 800.00),
('Tébessa', 700.00),
('Tlemcen', 700.00),
('Tiaret', 700.00),
('Tizi Ouzou', 600.00),
('Alger', 500.00),
('Djelfa', 700.00),
('Jijel', 700.00),
('Sétif', 700.00),
('Saïda', 700.00),
('Skikda', 700.00),
('Sidi Bel Abbès', 700.00),
('Annaba', 700.00),
('Guelma', 700.00),
('Constantine', 700.00),
('Médéa', 600.00),
('Mostaganem', 700.00),
('M’Sila', 700.00),
('Mascara', 700.00),
('Ouargla', 800.00),
('Oran', 700.00),
('El Bayadh', 700.00),
('Illizi', 800.00),
('Bordj Bou Arreridj', 700.00),
('Boumerdès', 600.00),
('El Tarf', 700.00),
('Tindouf', 900.00),
('Tissemsilt', 700.00),
('El Oued', 800.00),
('Khenchela', 700.00),
('Souk Ahras', 700.00),
('Tipaza', 600.00),
('Mila', 700.00),
('Aïn Defla', 700.00),
('Naâma', 700.00),
('Aïn Témouchent', 700.00),
('Ghardaïa', 800.00),
('Relizane', 700.00),
('Timimoun', 800.00),
('Bordj Badji Mokhtar', 900.00),
('Ouled Djellal', 800.00),
('Béni Abbès', 800.00),
('In Salah', 900.00),
('In Guezzam', 900.00),
('Touggourt', 800.00),
('Djanet', 900.00),
('El M’Ghair', 800.00),
('El Menia', 800.00);