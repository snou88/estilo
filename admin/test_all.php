<?php
session_start();
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Configuration des headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

function jsonResponse($data) {
    echo json_encode($data);
    exit;
}

try {
    // 1. Vérifier la connexion à la base de données
    require_once '../config/db_config.php';
    
    // Test simple de connexion
    $pdo->query("SELECT 1");
    $db_connected = true;
    
    // 2. Vérifier la table admins
    $stmt = $pdo->query("SHOW TABLES LIKE 'admins'");
    $admins_table = $stmt->fetch();
    
    // 3. Vérifier les colonnes de la table admins
    $stmt = $pdo->query("DESCRIBE admins");
    $admins_columns = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    // 4. Vérifier si un administrateur existe
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM admins");
    $admin_count = $stmt->fetch()['count'];
    
    // 5. Vérifier la session
    $session = [
        'started' => session_status() === PHP_SESSION_ACTIVE,
        'id' => session_id(),
        'name' => session_name()
    ];
    
    // 6. Vérifier la configuration CORS
    $headers = getallheaders();
    
    // 7. Vérifier la configuration du serveur
    $server_config = [
        'php_version' => phpversion(),
        'pdo_version' => PDO::getAvailableDrivers(),
        'mysql_version' => $pdo->getAttribute(PDO::ATTR_SERVER_VERSION)
    ];
    
    // Préparer la réponse
    $response = [
        'success' => true,
        'database' => [
            'connected' => $db_connected,
            'tables' => [
                'admins' => $admins_table ? 'exists' : 'not exists',
                'columns' => $admins_columns
            ],
            'admin_count' => $admin_count
        ],
        'session' => $session,
        'headers' => array_keys($headers),
        'server_config' => $server_config
    ];
    
    jsonResponse($response);
    
} catch (PDOException $e) {
    jsonResponse([
        'success' => false,
        'error' => 'Erreur de connexion à la base de données: ' . $e->getMessage()
    ]);
} catch (Exception $e) {
    jsonResponse([
        'success' => false,
        'error' => 'Erreur générale: ' . $e->getMessage()
    ]);
}
?>
