<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
header('Content-Type: application/json');
require_once 'verify_admin_token.php';
require_once '../config/db_config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Méthode non autorisée']);
    exit;
}

// Validate required fields
$name = $_POST['name'] ?? '';
$category_id = $_POST['category_id'] ?? '';
$price = $_POST['price'] ?? '';
$description = $_POST['description'] ?? '';

if (!$name || !$category_id || !$price) {
    http_response_code(400);
    echo json_encode(['error' => 'Champs obligatoires manquants']);
    exit;
}

try {
    // Insert product
    $stmt = $pdo->prepare('INSERT INTO products (name, category_id, price, description) VALUES (?, ?, ?, ?)');
    $stmt->execute([$name, $category_id, $price, $description]);
    $product_id = $pdo->lastInsertId();

    // Handle images
    $upload_dir = __DIR__ . '/../public/uploads/products/';
    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0777, true);
    }
    $is_main_arr = isset($_POST['is_main']) ? $_POST['is_main'] : [];
    $colors_arr = isset($_POST['colors']) ? $_POST['colors'] : [];
    $main_set = false;
    if (!empty($_FILES['images']['name'][0])) {
        foreach ($_FILES['images']['tmp_name'] as $i => $tmp_name) {
            if (!is_uploaded_file($tmp_name)) continue;
            $original = basename($_FILES['images']['name'][$i]);
            $ext = pathinfo($original, PATHINFO_EXTENSION);
            $filename = uniqid('prodimg_') . '.' . $ext;
            $target = $upload_dir . $filename;
            if (move_uploaded_file($tmp_name, $target)) {
                $is_main = (is_array($is_main_arr) && in_array((string)$i, $is_main_arr)) || (!$main_set && $i == 0);
                $main_set = $main_set || $is_main;
                $color = is_array($colors_arr) && isset($colors_arr[$i]) ? $colors_arr[$i] : '';
                $stmtImg = $pdo->prepare('INSERT INTO product_images (product_id, image_path, is_main, color) VALUES (?, ?, ?, ?)');
                $stmtImg->execute([$product_id, '/uploads/products/' . $filename, $is_main ? 1 : 0, $color]);
            }
        }
    }
    echo json_encode(['success' => true, 'product_id' => $product_id]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur serveur: ' . $e->getMessage()]);
} 