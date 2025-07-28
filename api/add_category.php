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
        throw new Exception('Le nom de la catégorie est requis');
    }
    
    $name = trim($data['name']);
    
    // Vérifier si la catégorie existe déjà
    $checkStmt = $pdo->prepare("SELECT id FROM categories WHERE name = :name");
    $checkStmt->execute([':name' => $name]);
    
    if ($checkStmt->rowCount() > 0) {
        throw new Exception('Cette catégorie existe déjà');
    }
    
    // Préparer et exécuter la requête d'insertion
    $stmt = $pdo->prepare("INSERT INTO categories (name) VALUES (:name)");
    $stmt->execute([':name' => $name]);
    
    $id = $pdo->lastInsertId();
    
    // Retourner la nouvelle catégorie ajoutée
    echo json_encode([
        'id' => $id, 
        'name' => $name,
        'created_at' => date('Y-m-d H:i:s')
    ]);
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['error' => $e->getMessage()]);
} finally {
    // Fermer les connexions
    if (isset($checkStmt)) {
        $checkStmt->close();
    }
    if (isset($stmt)) {
        $stmt->close();
    }
    if (isset($conn)) {
        $conn->close();
    }
}
?>
