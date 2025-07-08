<?php
session_start();
require_once '../config/db_config.php';

// Configuration des headers
header('Content-Type: application/json');

try {
    // Vérifier si la base de données est accessible
    $stmt = $pdo->query("SELECT 1");
    $result = $stmt->fetch();
    
    // Vérifier si la table admins existe
    $stmt = $pdo->query("SHOW TABLES LIKE 'admins'");
    $table_exists = $stmt->fetch();
    
    // Vérifier si un administrateur existe
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM admins");
    $admin_count = $stmt->fetch()['count'];
    
    echo json_encode([
        'success' => true,
        'database' => [
            'connected' => true,
            'tables' => [
                'admins' => $table_exists ? 'exists' : 'not exists'
            ],
            'admins_count' => $admin_count
        ]
    ]);
    
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'error' => 'Erreur de connexion à la base de données: ' . $e->getMessage()
    ]);
}
?>
