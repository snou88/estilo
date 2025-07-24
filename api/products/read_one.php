<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include_once '../config/database.php';
include_once '../models/Product.php';

$database = new Database();
$db = $database->getConnection();

$product = new Product($db);

$product->id = isset($_GET['id']) ? $_GET['id'] : die();

$product->readOne();

if($product->name != null) {
    $product_arr = array(
        "id" => $product->id,
        "name" => $product->name,
        "description" => $product->description,
        "price" => $product->price,
        "image_url" => $product->image_url,
        "sizes" => json_decode($product->sizes),
        "colors" => json_decode($product->colors),
        "stock_quantity" => $product->stock_quantity
    );

    http_response_code(200);
    echo json_encode($product_arr);
} else {
    http_response_code(404);
    echo json_encode(array("message" => "Produit non trouvé."));
}
?>