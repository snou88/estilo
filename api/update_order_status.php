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

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
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
    if (!isset($input['order_id']) || !isset($input['status'])) {
        http_response_code(400);
        echo json_encode(['error' => 'ID de commande et statut requis']);
        exit;
    }

    $orderId = (int)$input['order_id'];
    $status = $input['status'];

    // Validation du statut
    $validStatuses = ['pending', 'accepted', 'cancelled', 'delivered'];
    if (!in_array($status, $validStatuses)) {
        http_response_code(400);
        echo json_encode(['error' => 'Statut invalide']);
        exit;
    }

    // Mettre à jour le statut de la commande
    $stmt = $pdo->prepare("
        UPDATE orders 
        SET status = :status, updated_at = CURRENT_TIMESTAMP 
        WHERE id = :order_id
    ");

    $stmt->execute([
        ':status' => $status,
        ':order_id' => $orderId
    ]);

    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(['error' => 'Commande non trouvée']);
        exit;
    }

    // Récupérer la commande mise à jour
    $orderStmt = $pdo->prepare("
        SELECT o.*, 
               JSON_ARRAYAGG(
                   JSON_OBJECT(
                       'id', oi.id,
                       'product_id', oi.product_id,
                       'product_name', p.name,
                       'quantity', oi.quantity,
                       'unit_price', oi.unit_price,
                       'total_price', (oi.quantity * oi.unit_price)
                   )
               ) as items
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        LEFT JOIN products p ON oi.product_id = p.id
        WHERE o.id = :order_id
        GROUP BY o.id
    ");
    
    $orderStmt->execute([':order_id' => $orderId]);
    $order = $orderStmt->fetch(PDO::FETCH_ASSOC);

    if ($order) {
        if ($order['items'] === null) {
            $order['items'] = [];
        } else {
            $order['items'] = json_decode($order['items'], true);
        }
        
        $order['created_at'] = date('d/m/Y H:i', strtotime($order['created_at']));
        $order['updated_at'] = date('d/m/Y H:i', strtotime($order['updated_at']));
        $order['shipping_price'] = (float)$order['shipping_price'];
        $order['total_amount'] = (float)$order['total_amount'];
    }

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Statut de la commande mis à jour avec succès',
        'order' => $order
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur lors de la mise à jour: ' . $e->getMessage()]);
}
?> 