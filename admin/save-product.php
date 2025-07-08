<?php
require_once 'check_session.php';
require_once '../config/db_config.php';

$action = $_POST['action'] ?? '';
$product_id = $_POST['product_id'] ?? 0;
$name = $_POST['name'] ?? '';
$description = $_POST['description'] ?? '';
$price = $_POST['price'] ?? 0;
$category_id = $_POST['category_id'] ?? 0;

if ($action === 'create') {
    // Créer un nouveau produit
    $stmt = $pdo->prepare("INSERT INTO products (name, description, price, category_id) VALUES (?, ?, ?, ?)");
    $stmt->execute([$name, $description, $price, $category_id]);
    $product_id = $pdo->lastInsertId();
    
    // Gérer les images
    if (isset($_FILES['images']) && is_array($_FILES['images']['tmp_name'])) {
        foreach ($_FILES['images']['tmp_name'] as $key => $tmp_name) {
            if ($tmp_name) {
                $image_path = "uploads/products/" . uniqid() . basename($_FILES['images']['name'][$key]);
                move_uploaded_file($tmp_name, "../" . $image_path);
                
                $stmt = $pdo->prepare("INSERT INTO product_images (product_id, image_path) VALUES (?, ?)");
                $stmt->execute([$product_id, $image_path]);
            }
        }
    }
    
    $_SESSION['success'] = "Le produit a été créé avec succès";
} elseif ($action === 'update' && $product_id > 0) {
    // Mettre à jour le produit
    $stmt = $pdo->prepare("UPDATE products SET name = ?, description = ?, price = ?, category_id = ? WHERE id = ?");
    $stmt->execute([$name, $description, $price, $category_id, $product_id]);
    
    // Gérer les nouvelles images
    if (isset($_FILES['images']) && is_array($_FILES['images']['tmp_name'])) {
        foreach ($_FILES['images']['tmp_name'] as $key => $tmp_name) {
            if ($tmp_name) {
                $image_path = "uploads/products/" . uniqid() . basename($_FILES['images']['name'][$key]);
                move_uploaded_file($tmp_name, "../" . $image_path);
                
                $stmt = $pdo->prepare("INSERT INTO product_images (product_id, image_path) VALUES (?, ?)");
                $stmt->execute([$product_id, $image_path]);
            }
        }
    }
    
    $_SESSION['success'] = "Le produit a été mis à jour avec succès";
} else {
    $_SESSION['error'] = "Action invalide";
}

header('Location: products.php');
exit;
