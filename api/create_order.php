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

require_once '../config/db_config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Méthode non autorisée']);
    exit;
}

try {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        http_response_code(400);
        echo json_encode(['error' => 'Données JSON invalides']);
        exit;
    }

    // Validation des données requises
    $requiredFields = [
        'customer_name', 'customer_phone', 
        'shipping_address', 'shipping_city', 'shipping_zip', 'wilaya_id',
        'items'
    ];

    foreach ($requiredFields as $field) {
        if (!isset($input[$field]) || empty($input[$field])) {
            http_response_code(400);
            echo json_encode(['error' => "Le champ '$field' est requis"]);
            exit;
        }
    }

    // Récupérer le prix de livraison depuis la table wilayas
    $wilayaStmt = $pdo->prepare('SELECT shipping_price, name FROM wilayas WHERE id = ?');
    $wilayaStmt->execute([$input['wilaya_id']]);
    $wilaya = $wilayaStmt->fetch(PDO::FETCH_ASSOC);
    if (!$wilaya) {
        http_response_code(400);
        echo json_encode(['error' => 'Wilaya invalide']);
        exit;
    }
    $shipping_price = (float)$wilaya['shipping_price'];

    // Validation des items
    if (!is_array($input['items']) || empty($input['items'])) {
        http_response_code(400);
        echo json_encode(['error' => 'La commande doit contenir au moins un article']);
        exit;
    }

    // Démarrer une transaction
    $pdo->beginTransaction();

    try {
        // Insérer la commande
        $orderStmt = $pdo->prepare("
            INSERT INTO orders (
                customer_name, customer_phone, 
                shipping_address, shipping_city, shipping_zip, wilaya_id,
                total_amount, status
            ) VALUES (
                :customer_name, :customer_phone,
                :shipping_address, :shipping_city, :shipping_zip, :wilaya_id,
                :total_amount, 'pending'
            )
        ");

        $total_amount = 0;
        foreach ($input['items'] as $item) {
            $total_amount += $item['unit_price'] * $item['quantity'];
        }
        $total_amount += $shipping_price;

        $orderStmt->execute([
            ':customer_name' => $input['customer_name'],
            ':customer_phone' => $input['customer_phone'],
            ':shipping_address' => $input['shipping_address'],
            ':shipping_city' => $input['shipping_city'],
            ':shipping_zip' => $input['shipping_zip'],
            ':wilaya_id' => $input['wilaya_id'],
            ':total_amount' => $total_amount
        ]);

        $orderId = $pdo->lastInsertId();

        // Insérer les items de commande
        $itemStmt = $pdo->prepare("
            INSERT INTO order_items (
                order_id, product_id, size, quantity, unit_price
            ) VALUES (
                :order_id, :product_id, :size, :quantity, :unit_price
            )
        ");

        foreach ($input['items'] as $item) {
            if (!isset($item['product_id']) || !isset($item['quantity']) || !isset($item['unit_price'])) {
                throw new Exception('Données d\'article incomplètes');
            }
            $itemStmt->execute([
                ':order_id' => $orderId,
                ':product_id' => $item['product_id'],
                ':size' => isset($item['size']) ? $item['size'] : null,
                ':quantity' => $item['quantity'],
                ':unit_price' => $item['unit_price']
            ]);
        }

        // Valider la transaction
        $pdo->commit();

        // Récupérer la commande créée avec ses détails
        $orderStmt = $pdo->prepare("
            SELECT o.*, 
                   GROUP_CONCAT(CONCAT(oi.quantity, 'x ', p.name) SEPARATOR ', ') as items_summary
            FROM orders o
            LEFT JOIN order_items oi ON o.id = oi.order_id
            LEFT JOIN products p ON oi.product_id = p.id
            WHERE o.id = :order_id
            GROUP BY o.id
        ");
        $orderStmt->execute([':order_id' => $orderId]);
        $order = $orderStmt->fetch(PDO::FETCH_ASSOC);

        http_response_code(201);
        echo json_encode([
            'success' => true,
            'message' => 'Commande créée avec succès',
            'order' => $order
        ]);

    } catch (Exception $e) {
        $pdo->rollBack();
        throw $e;
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur lors de la création de la commande: ' . $e->getMessage()]);
}
?> 