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
    // Récupérer toutes les commandes avec leurs items
    $sql = "
        SELECT 
            o.id,
            o.customer_name,
            o.customer_phone,
            o.shipping_address,
            o.shipping_city,
            o.shipping_zip,
            o.wilaya_id,
            w.name AS wilaya_name,
            w.shipping_price AS wilaya_shipping_price,
            -- o.shipping_price, (supprimé)
            o.total_amount,
            o.status,
            o.created_at,
            o.updated_at,
            JSON_ARRAYAGG(
                JSON_OBJECT(
                    'id', oi.id,
                    'product_id', oi.product_id,
                    'product_name', p.name,
                    'size', oi.size,
                    'color', oi.color,
                    'quantity', oi.quantity,
                    'unit_price', oi.unit_price,
                    'total_price', (oi.quantity * oi.unit_price)
                )
            ) as items
        FROM orders o
        LEFT JOIN wilayas w ON o.wilaya_id = w.id
        LEFT JOIN order_items oi ON o.id = oi.order_id
        LEFT JOIN products p ON oi.product_id = p.id
        GROUP BY o.id
        ORDER BY o.created_at DESC
    ";
    
    $stmt = $pdo->query($sql);
    $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Traiter les items JSON pour chaque commande
    foreach ($orders as &$order) {
        if ($order['items'] === null) {
            $order['items'] = [];
        } else {
            $order['items'] = json_decode($order['items'], true);
        }
        
        // Formater les dates
        $order['created_at'] = date('d/m/Y H:i', strtotime($order['created_at']));
        $order['updated_at'] = date('d/m/Y H:i', strtotime($order['updated_at']));
        
        // Formater les montants
        // $order['shipping_price'] = (float)$order['shipping_price']; // This line is removed
        $order['total_amount'] = (float)$order['total_amount'];
    }
    
    echo json_encode([
        'success' => true,
        'orders' => $orders
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur serveur: ' . $e->getMessage()]);
}
?> 