<?php
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
if  ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
header('Content-Type: application/json');
require_once 'verify_admin_token.php';
require_once '../config/db_config.php';

try {
    // Join products with one image (main if possible, else any)
    $sql = 'SELECT p.*, c.name AS category
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            ORDER BY p.id ASC';
    $stmt = $pdo->query($sql);
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
    // Pour chaque produit, récupérer l'image principale (et couleur)
    foreach ($products as &$product) {
        $imgStmt = $pdo->prepare('SELECT image_path, color FROM product_images WHERE product_id = ? AND is_main = 1 LIMIT 1');
        $imgStmt->execute([$product['id']]);
        $img = $imgStmt->fetch(PDO::FETCH_ASSOC);
        if ($img) {
            $product['image'] = $img['image_path'];
            $product['color'] = $img['color'];
        } else {
            // Si pas d'image principale, prendre la première image
            $imgStmt2 = $pdo->prepare('SELECT image_path, color FROM product_images WHERE product_id = ? LIMIT 1');
            $imgStmt2->execute([$product['id']]);
            $img2 = $imgStmt2->fetch(PDO::FETCH_ASSOC);
            $product['image'] = $img2 ? $img2['image_path'] : '';
            $product['color'] = $img2 ? $img2['color'] : '';
        }
    }
    echo json_encode(['products' => $products]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur serveur: ' . $e->getMessage()]);
} 