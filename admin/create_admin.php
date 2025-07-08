<?php
session_start();
require_once '../config/db_config.php';

// Configuration de la session
ini_set('session.cookie_httponly', 1);
ini_set('session.use_only_cookies', 1);
ini_set('session.cookie_secure', true);
ini_set('session.cookie_samesite', 'Lax');

// Configuration des headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Expose-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

function jsonResponse($data) {
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

// Créer un administrateur de test
try {
    // Vérifier si l'administrateur existe déjà
    $stmt = $pdo->prepare("SELECT id FROM admins WHERE email = ?");
    $stmt->execute(['admin@estilo.com']);
    
    if ($stmt->fetch()) {
        jsonResponse(['success' => false, 'error' => 'Un administrateur existe déjà']);
    }

    // Créer un nouveau mot de passe sécurisé
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

    jsonResponse([
        'success' => true,
        'message' => 'Administrateur créé avec succès',
        'credentials' => [
            'email' => 'admin@estilo.com',
            'password' => $password
        ]
    ]);

} catch (PDOException $e) {
    error_log("Erreur lors de la création de l'administrateur: " . $e->getMessage());
    jsonResponse(['success' => false, 'error' => 'Une erreur est survenue lors de la création']);
}
?>
