<?php
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
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

if (!isset($_POST['id'], $_POST['name'], $_POST['category_id'], $_POST['price'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Champs obligatoires manquants']);
    exit;
}

$id = intval($_POST['id']);
$name = trim($_POST['name']);
$category_id = intval($_POST['category_id']);
$price = floatval($_POST['price']);
$description = isset($_POST['description']) ? trim($_POST['description']) : '';

try {
    // 1. Mettre à jour le produit
    $sql = 'UPDATE products SET name = ?, category_id = ?, price = ?, description = ? WHERE id = ?';
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$name, $category_id, $price, $description, $id]);

    // 2. Supprimer les images demandées
    if (!empty($_POST['delete_image_ids'])) {
        $deleteIds = json_decode($_POST['delete_image_ids'], true);
        if (is_array($deleteIds) && count($deleteIds) > 0) {
            $in = implode(',', array_fill(0, count($deleteIds), '?'));
            $stmtDel = $pdo->prepare("DELETE FROM product_images WHERE id IN ($in) AND product_id = ?");
            $stmtDel->execute([...$deleteIds, $id]);
        }
    }

    // 3. Mettre à jour couleur/is_main des images existantes
    if (!empty($_POST['update_images'])) {
        $updateImages = json_decode($_POST['update_images'], true);
        if (is_array($updateImages)) {
            foreach ($updateImages as $img) {
                if (!isset($img['id'])) continue;
                $stmtUp = $pdo->prepare('UPDATE product_images SET color = ?, is_main = ? WHERE id = ? AND product_id = ?');
                $stmtUp->execute([
                    $img['color'] ?? '',
                    !empty($img['is_main']) ? 1 : 0,
                    $img['id'],
                    $id
                ]);
            }
        }
    }

    // 4. Ajouter de nouvelles images
    if (!empty($_FILES['images']['name'][0])) {
        $upload_dir = __DIR__ . '/../public/uploads/products/';
        if (!is_dir($upload_dir)) {
            mkdir($upload_dir, 0777, true);
        }
        $is_main_arr = isset($_POST['is_main']) ? $_POST['is_main'] : [];
        $colors_arr = isset($_POST['colors']) ? $_POST['colors'] : [];
        $main_set = false;
        foreach ($_FILES['images']['tmp_name'] as $i => $tmp_name) {
            if (!is_uploaded_file($tmp_name)) continue;
            $original = basename($_FILES['images']['name'][$i]);
            $ext = pathinfo($original, PATHINFO_EXTENSION);
            $filename = uniqid('prodimg_') . '.' . $ext;
            $target = $upload_dir . $filename;
            if (move_uploaded_file($tmp_name, $target)) {
                $is_main = (is_array($is_main_arr) && in_array((string)$i, $is_main_arr));
                $color = is_array($colors_arr) && isset($colors_arr[$i]) ? $colors_arr[$i] : '';
                $stmtImg = $pdo->prepare('INSERT INTO product_images (product_id, image_path, is_main, color) VALUES (?, ?, ?, ?)');
                $stmtImg->execute([$id, '/uploads/products/' . $filename, $is_main ? 1 : 0, $color]);
            }
        }
    }

    // 5. S'assurer qu'une seule image est principale
    $stmtMain = $pdo->prepare('SELECT id FROM product_images WHERE product_id = ? AND is_main = 1');
    $stmtMain->execute([$id]);
    $mainImages = $stmtMain->fetchAll(PDO::FETCH_COLUMN);
    if (count($mainImages) > 1) {
        // On garde la première comme principale, les autres repassent à 0
        $keep = array_shift($mainImages);
        if (count($mainImages) > 0) {
            $in = implode(',', array_fill(0, count($mainImages), '?'));
            $stmtReset = $pdo->prepare("UPDATE product_images SET is_main = 0 WHERE id IN ($in)");
            $stmtReset->execute($mainImages);
        }
    }

    // 6. Retourner le produit avec ses images
    $stmtProd = $pdo->prepare('SELECT * FROM products WHERE id = ?');
    $stmtProd->execute([$id]);
    $product = $stmtProd->fetch(PDO::FETCH_ASSOC);
    $stmtImgs = $pdo->prepare('SELECT * FROM product_images WHERE product_id = ?');
    $stmtImgs->execute([$id]);
    $images = $stmtImgs->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'product' => $product, 'images' => $images]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur serveur: ' . $e->getMessage()]);
} 