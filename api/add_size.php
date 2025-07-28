<?php
// En-têtes CORS
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Gérer les requêtes OPTIONS pour le CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../../config/db_config.php';

// Vérifier la connexion
if (!isset($pdo)) {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur de connexion à la base de données']);
    exit();
}

try {
    // Récupérer les données JSON du corps de la requête
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!isset($data['name']) || empty(trim($data['name']))) {
        throw new Exception('Le nom de la taille est requis');
    }
    
    $name = trim($data['name']);
    
    // Vérifier si la taille existe déjà
    $checkStmt = $pdo->prepare("SELECT id FROM sizes WHERE name = :name");
    $checkStmt->execute([':name' => $name]);
    
    if ($checkStmt->rowCount() > 0) {
        throw new Exception('Cette taille existe déjà');
    }
    
    // Préparer et exécuter la requête d'insertion
    $stmt = $pdo->prepare("INSERT INTO sizes (name) VALUES (:name)");
    $stmt->execute([':name' => $name]);
    
    $id = $pdo->lastInsertId();
    
    // Retourner la nouvelle taille ajoutée
    echo json_encode([
        'id' => $id, 
        'name' => $name
    ]);
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['error' => $e->getMessage()]);
} finally {
    // Fermer la connexion
    if (isset($stmt)) {
        $stmt->close();
    }
    if (isset($conn)) {
        $conn->close();
    }
}
?>
