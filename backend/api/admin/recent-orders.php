<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

try {
    $query = "SELECT 
                o.id,
                o.total_amount,
                o.status,
                o.created_at,
                CONCAT(u.first_name, ' ', u.last_name) as customer_name
              FROM orders o
              LEFT JOIN users u ON o.user_id = u.id
              ORDER BY o.created_at DESC
              LIMIT 10";
    
    $stmt = $db->prepare($query);
    $stmt->execute();
    
    $orders = array();
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $orders[] = array(
            "id" => (int)$row['id'],
            "customer_name" => $row['customer_name'] ?: 'Client supprimé',
            "total_amount" => (float)$row['total_amount'],
            "status" => $row['status'],
            "created_at" => $row['created_at']
        );
    }
    
    http_response_code(200);
    echo json_encode($orders);
    
} catch(PDOException $exception) {
    http_response_code(500);
    echo json_encode(array("message" => "Erreur: " . $exception->getMessage()));
}
?>