<?php
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: PUT, OPTIONS");
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config/db_config.php';

if (!isset($pdo)) {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur de connexion à la base de données']);
    exit();
}

try {
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['id']) || !isset($data['name']) || empty(trim($data['name']))) {
        throw new Exception("ID et nouveau nom de taille requis");
    }

    $id = intval($data['id']);
    $name = trim($data['name']);

    $stmt = $pdo->prepare("UPDATE sizes SET name = :name WHERE id = :id");
    $stmt->execute([':name' => $name, ':id' => $id]);

    echo json_encode(['success' => true, 'id' => $id, 'name' => $name]);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['error' => $e->getMessage()]);
} finally {
    if (isset($stmt)) $stmt->closeCursor();
    $pdo = null;
}
?>