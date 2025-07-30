<?php
header('Content-Type: application/json; charset=UTF-8');
require_once '../config/db_config.php';

try {
    $data = json_decode(file_get_contents('php://input'), true);
    if (!isset($data['id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'ID manquant']);
        exit;
    }
    $stmt = $pdo->prepare('DELETE FROM wilayas WHERE id = ?');
    $stmt->execute([$data['id']]);
    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur serveur: ' . $e->getMessage()]);
}