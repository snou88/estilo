<?php
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once '../../config/db_config.php';

try {
    // Get product ID from query string
    if (!isset($_GET['id']) || !is_numeric($_GET['id'])) {
        http_response_code(400);
        echo json_encode(["error" => "ID du produit manquant ou invalide"]);
        exit;
    }
    $id = (int)$_GET['id'];

    // Get product info with category
    $sql = "SELECT p.id, p.name, p.description, p.price, p.category_id, c.name as category_name
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.id = :id
            LIMIT 1";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([':id' => $id]);
    $product = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$product) {
        http_response_code(404);
        echo json_encode(["error" => "Produit non trouvé"]);
        exit;
    }

    // Get all images for the product
    $imgStmt = $pdo->prepare("SELECT image_path, color, is_main FROM product_images WHERE product_id = :id");
    $imgStmt->execute([':id' => $id]);
    $images = $imgStmt->fetchAll(PDO::FETCH_ASSOC);

    // Get all available colors for this product
    $colors = [];
    foreach ($images as $img) {
        if ($img['color'] && !in_array($img['color'], $colors)) {
            $colors[] = $img['color'];
        }
    }

    // Get all available sizes for this product (if you have a sizes table, otherwise mock)
     $sizeStmt = $pdo->prepare("SELECT name FROM sizes WHERE category_id = :id");
    // For now, let's mock:
    $sizeStmt->execute([':id' => $product['category_id']]);
    $sizes = $sizeStmt->fetchAll(PDO::FETCH_ASSOC);
    $sizes = array_map(function($size) {
        return $size['name'];
    }, $sizes);
    

    // Get old price if you have a discount system (mock here)
    $oldPrice = $product['price'] + 2000;

    // Prepare response
    $response = [
        "id" => $product['id'],
        "name" => $product['name'],
        "description" => $product['description'],
        "price" => (float)$product['price'],
        "oldPrice" => (float)$oldPrice,
        "category_id" => $product['category_id'],
        "category_name" => $product['category_name'],
        "images" => $images,
        "colors" => $colors,
        "sizes" => $sizes,
        "deliveryBase" => 600, // DA, mock
        "badges" => ['Nouveau', 'Best Seller', 'Livraison rapide'] // mock badges
    ];

    http_response_code(200);
    echo json_encode($response);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Erreur serveur: " . $e->getMessage()]);
}