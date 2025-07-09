<?php
require_once '../config/db_config.php';

try {
    // Vérifier si la table admins existe et contient des données
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM admins");
    $result = $stmt->fetch();
    echo "Nombre d'administrateurs: " . $result['count'];
    
    // Si aucun admin, créer un admin de test
    if ($result['count'] == 0) {
        $password = password_hash('admin123', PASSWORD_DEFAULT);
        $stmt = $pdo->prepare("INSERT INTO admins (email, password, full_name) VALUES (?, ?, ?)");
        $stmt->execute(['admin@estilo.com', $password, 'Administrateur']);
        echo "\nUn administrateur de test a été créé avec les informations suivantes:\n";
        echo "Email: admin@estilo.com\n";
        echo "Mot de passe: admin123\n";
    }
} catch (PDOException $e) {
    echo "Erreur: " . $e->getMessage();
}
?>
