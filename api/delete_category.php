<?php
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once '../config/db_config.php';

// Gérer les requêtes OPTIONS pour le CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include '../config/db_config.php';

// Vérifier la connexion
if (!isset($pdo)) {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur de connexion à la base de données']);
    exit();
}

try {
    // Récupérer les données JSON du corps de la requête
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!isset($data['id']) || !is_numeric($data['id'])) {
        throw new Exception('ID de catégorie invalide');
    }
    
    $id = intval($data['id']);
    
    // Vérifier si la catégorie existe
    $checkStmt = $pdo->prepare("SELECT id FROM categories WHERE id = :id");
    $checkStmt->execute([':id' => $id]);
    
    if ($checkStmt->rowCount() === 0) {
        throw new Exception('Aucune catégorie trouvée avec cet ID');
    }
    
    // Vérifier si la catégorie est utilisée par des produits
    $checkProductsStmt = $pdo->prepare("SELECT COUNT(*) as count FROM products WHERE category_id = :id");
    $checkProductsStmt->execute([':id' => $id]);
    $row = $checkProductsStmt->fetch(PDO::FETCH_ASSOC);
    
    if ($row['count'] > 0) {
        throw new Exception('Impossible de supprimer cette catégorie car elle est utilisée par des produits');
    }
    
    // Supprimer la catégorie
    $stmt = $pdo->prepare("DELETE FROM categories WHERE id = :id");
    $stmt->execute([':id' => $id]);
    
    echo json_encode(['success' => true, 'message' => 'Catégorie supprimée avec succès']);
    
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
