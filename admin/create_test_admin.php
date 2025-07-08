<?php
session_start();
require_once '../config/db_config.php';

// Configuration des headers
header('Content-Type: application/json');

try {
    // Vérifier si l'administrateur existe déjà
    $stmt = $pdo->prepare("SELECT COUNT(*) as count FROM admins WHERE email = ?");
    $stmt->execute(['admin@estilo.com']);
    $admin_exists = $stmt->fetch()['count'] > 0;
    
    if ($admin_exists) {
        echo json_encode([
            'success' => false,
            'message' => 'Un administrateur existe déjà avec cet email'
        ]);
        exit;
    }

    // Créer un mot de passe sécurisé
    $password = 'admin123';
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    // Insérer l'administrateur
    $stmt = $pdo->prepare("
        INSERT INTO admins (email, password, full_name) 
        VALUES (?, ?, ?)
    ");
    
    $stmt->execute([
        'admin@estilo.com',
        $hashed_password,
        'Administrateur Système'
    ]);

    echo json_encode([
        'success' => true,
        'message' => 'Administrateur créé avec succès',
        'credentials' => [
            'email' => 'admin@estilo.com',
            'password' => $password
        ]
    ]);

} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Erreur lors de la création de l\'administrateur: ' . $e->getMessage()
    ]);
}
?>
