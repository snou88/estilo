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

try {
    // Récupérer toutes les commandes avec leurs items (chaque ligne = une commande * item)
    $sql = "
        SELECT 
            o.id AS order_id,
            o.customer_name,
            o.customer_phone,
            o.shipping_address,
            o.shipping_city,
            o.shipping_zip,
            o.wilaya_id,
            w.name AS wilaya_name,
            w.shipping_price AS wilaya_shipping_price,
            o.total_amount,
            o.status,
            o.created_at,
            o.updated_at,
            oi.id AS item_id,
            oi.product_id,
            p.name AS product_name,
            oi.size,
            oi.color,
            oi.quantity,
            oi.unit_price
        FROM orders o
        LEFT JOIN wilayas w ON o.wilaya_id = w.id
        LEFT JOIN order_items oi ON o.id = oi.order_id
        LEFT JOIN products p ON oi.product_id = p.id
        ORDER BY o.created_at DESC
    ";

    $stmt = $pdo->query($sql);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $orders = [];

    foreach ($rows as $row) {
        $id = $row['order_id'];

        // Initialiser la commande si elle n'existe pas encore
        if (!isset($orders[$id])) {
            $orders[$id] = [
                'id' => $id,
                'customer_name' => $row['customer_name'],
                'customer_phone' => $row['customer_phone'],
                'shipping_address' => $row['shipping_address'],
                'shipping_city' => $row['shipping_city'],
                'shipping_zip' => $row['shipping_zip'],
                'wilaya_id' => $row['wilaya_id'],
                'wilaya_name' => $row['wilaya_name'],
                'wilaya_shipping_price' => (float)$row['wilaya_shipping_price'],
                'total_amount' => (float)$row['total_amount'],
                'status' => $row['status'],
                'created_at' => date('d/m/Y H:i', strtotime($row['created_at'])),
                'updated_at' => date('d/m/Y H:i', strtotime($row['updated_at'])),
                'items' => []
            ];
        }

        // Ajouter l'item s'il existe (évite les lignes vides si LEFT JOIN sans order_items)
        if (!empty($row['item_id'])) {
            $orders[$id]['items'][] = [
                'id' => $row['item_id'],
                'product_id' => $row['product_id'],
                'product_name' => $row['product_name'],
                'size' => $row['size'],
                'color' => $row['color'],
                'quantity' => (int)$row['quantity'],
                'unit_price' => (float)$row['unit_price'],
                'total_price' => (float)$row['unit_price'] * (int)$row['quantity']
            ];
        }
    }

    // Réindexer les commandes (de associative à array)
    $orders = array_values($orders);

    echo json_encode([
        'success' => true,
        'orders' => $orders
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur serveur: ' . $e->getMessage()]);
}
?>