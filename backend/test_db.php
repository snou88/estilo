<?php
require_once 'config/config.php';

try {
    $pdo = new PDO(
        "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME,
        DB_USER,
        DB_PASS,
        array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION)
    );
    
    echo "Connexion à la base de données réussie !<br><br>";
    
    // Tester la création d'une catégorie
    $stmt = $pdo->prepare("INSERT INTO categories (name, description) VALUES (?, ?)");
    $stmt->execute(['Test Category', 'Cette catégorie est un test']);
    
    echo "Catégorie test créée avec succès !<br><br>";
    
    // Vérifier la catégorie créée
    $stmt = $pdo->query("SELECT * FROM categories");
    $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "Catégories dans la base de données :<br>";
    foreach ($categories as $category) {
        echo "ID: " . $category['id'] . ", Nom: " . $category['name'] . ", Description: " . $category['description'] . "<br>";
    }
} catch(PDOException $e) {
    echo "Erreur de connexion : " . $e->getMessage();
}
?>
