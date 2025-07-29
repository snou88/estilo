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

require_once '../config/db_config.php';

// Vérifier la connexion
if (!isset($pdo)) {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur de connexion à la base de données']);
    exit();
}

try {
    // Récupérer les données JSON envoyées
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['category_id']) || !isset($data['size_name']) || empty(trim($data['size_name']))) {
        throw new Exception('Les données sont incomplètes');
    }

    $categoryId = intval($data['category_id']);
    $sizeName = trim($data['size_name']);

    // Vérifier si la catégorie existe
    $checkCategory = $pdo->prepare("SELECT id FROM categories WHERE id = :id");
    $checkCategory->execute([':id' => $categoryId]);
    if ($checkCategory->rowCount() === 0) {
        throw new Exception('Catégorie introuvable');
    }

    // Vérifier si la taille existe déjà pour cette catégorie
    $checkSize = $pdo->prepare("SELECT id FROM sizes WHERE category_id = :category_id AND name = :name");
    $checkSize->execute([':category_id' => $categoryId, ':name' => $sizeName]);
    if ($checkSize->rowCount() > 0) {
        throw new Exception('Cette taille existe déjà pour cette catégorie');
    }

    // Insérer la nouvelle taille
    $insert = $pdo->prepare("INSERT INTO sizes (category_id, name) VALUES (:category_id, :name)");
    $insert->execute([':category_id' => $categoryId, ':name' => $sizeName]);

    $sizeId = $pdo->lastInsertId();

    // Retourner la taille ajoutée
    echo json_encode([
        'id' => $sizeId,
        'name' => $sizeName
    ]);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['error' => $e->getMessage()]);
} finally {
    if (isset($checkCategory)) $checkCategory->closeCursor();
    if (isset($checkSize)) $checkSize->closeCursor();
    if (isset($insert)) $insert->closeCursor();
    if (isset($pdo)) $pdo = null;
}
?>