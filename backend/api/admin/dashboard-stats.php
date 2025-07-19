<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

try {
    // Statistiques générales
    $stats = array();
    
    // Total produits
    $query = "SELECT COUNT(*) as total FROM products WHERE is_active = 1";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    $stats['totalProducts'] = (int)$result['total'];
    
    // Total commandes
    $query = "SELECT COUNT(*) as total FROM orders";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    $stats['totalOrders'] = (int)$result['total'];
    
    // Total utilisateurs
    $query = "SELECT COUNT(*) as total FROM users WHERE is_active = 1";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    $stats['totalUsers'] = (int)$result['total'];
    
    // Chiffre d'affaires total
    $query = "SELECT COALESCE(SUM(total_amount), 0) as total FROM orders WHERE payment_status = 'paid'";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    $stats['totalRevenue'] = (float)$result['total'];
    
    // Commandes en attente
    $query = "SELECT COUNT(*) as total FROM orders WHERE status = 'pending'";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    $stats['pendingOrders'] = (int)$result['total'];
    
    // Messages non lus (table contact_messages)
    $query = "SELECT COUNT(*) as total FROM contact_messages WHERE is_read = 0";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    $stats['newMessages'] = (int)$result['total'];
    
    http_response_code(200);
    echo json_encode($stats);
    
} catch(PDOException $exception) {
    http_response_code(500);
    echo json_encode(array("message" => "Erreur: " . $exception->getMessage()));
}
?>