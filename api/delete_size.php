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
    
    if (!isset($data['id']) || !is_numeric($data['id'])) {
        throw new Exception('ID de taille invalide');
    }
    
    $id = intval($data['id']);
    
    // Vérifier d'abord si la taille existe
    $checkStmt = $pdo->prepare("SELECT id FROM sizes WHERE id = :id");
    $checkStmt->execute([':id' => $id]);
    
    if ($checkStmt->rowCount() === 0) {
        throw new Exception('Aucune taille trouvée avec cet ID');
    }
    
    // Supprimer la taille
    $stmt = $pdo->prepare("DELETE FROM sizes WHERE id = :id");
    $stmt->execute([':id' => $id]);
    
    echo json_encode(['success' => true, 'message' => 'Taille supprimée avec succès']);
    
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
