<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
if (  $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
header('Content-Type: application/json');
require_once 'verify_admin_token.php';
require_once '../config/db_config.php';

try {
    // Join products with one image (main if possible, else any)
    $sql = 'SELECT p.*, c.name AS category, COALESCE(pi.image_path, "") AS image
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN product_images pi ON pi.product_id = p.id AND pi.is_main = TRUE
            GROUP BY p.id
            ORDER BY p.id ASC';
    $stmt = $pdo->query($sql);
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
    // If no main image, get any image for products with no image
    foreach ($products as &$product) {
        if (empty($product['image'])) {
            $imgStmt = $pdo->prepare('SELECT image_path FROM product_images WHERE product_id = ? LIMIT 1');
            $imgStmt->execute([$product['id']]);
            $img = $imgStmt->fetchColumn();
            $product['image'] = $img ? $img : '';
        }
    }
    echo json_encode(['products' => $products]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur serveur: ' . $e->getMessage()]);
} 