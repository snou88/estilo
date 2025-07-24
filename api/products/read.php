<?php
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once '../../config/db_config.php';

try {
    $sql = "SELECT p.id, p.name, p.description, p.price, p.category_id,
                   (
                       SELECT image_path FROM product_images
                       WHERE product_id = p.id
                       ORDER BY is_main DESC, id ASC
                       LIMIT 1
                   ) AS image_url
            FROM products p";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $products = $stmt->fetchAll();

    http_response_code(200);
    echo json_encode(["products" => $products]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Erreur serveur: " . $e->getMessage()]);
}
?>