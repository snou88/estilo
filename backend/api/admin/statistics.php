<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

$period = isset($_GET['period']) ? $_GET['period'] : 'month';

try {
    $stats = array();
    
    // Définir la période
    switch($period) {
        case 'week':
            $dateCondition = "DATE(created_at) >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)";
            $previousDateCondition = "DATE(created_at) >= DATE_SUB(CURDATE(), INTERVAL 14 DAY) AND DATE(created_at) < DATE_SUB(CURDATE(), INTERVAL 7 DAY)";
            break;
        case 'quarter':
            $dateCondition = "DATE(created_at) >= DATE_SUB(CURDATE(), INTERVAL 3 MONTH)";
            $previousDateCondition = "DATE(created_at) >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH) AND DATE(created_at) < DATE_SUB(CURDATE(), INTERVAL 3 MONTH)";
            break;
        case 'year':
            $dateCondition = "DATE(created_at) >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR)";
            $previousDateCondition = "DATE(created_at) >= DATE_SUB(CURDATE(), INTERVAL 2 YEAR) AND DATE(created_at) < DATE_SUB(CURDATE(), INTERVAL 1 YEAR)";
            break;
        default: // month
            $dateCondition = "DATE(created_at) >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)";
            $previousDateCondition = "DATE(created_at) >= DATE_SUB(CURDATE(), INTERVAL 2 MONTH) AND DATE(created_at) < DATE_SUB(CURDATE(), INTERVAL 1 MONTH)";
            break;
    }
    
    // Chiffre d'affaires total
    $query = "SELECT COALESCE(SUM(total_amount), 0) as total FROM orders WHERE payment_status = 'paid' AND $dateCondition";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    $stats['totalRevenue'] = (float)$result['total'];
    
    // Chiffre d'affaires période précédente
    $query = "SELECT COALESCE(SUM(total_amount), 0) as total FROM orders WHERE payment_status = 'paid' AND $previousDateCondition";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    $previousRevenue = (float)$result['total'];
    
    // Calcul croissance chiffre d'affaires
    $stats['recentStats']['revenueGrowth'] = $previousRevenue > 0 ? 
        (($stats['totalRevenue'] - $previousRevenue) / $previousRevenue) * 100 : 0;
    
    // Nombre de commandes
    $query = "SELECT COUNT(*) as total FROM orders WHERE $dateCondition";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    $stats['totalOrders'] = (int)$result['total'];
    
    // Commandes période précédente
    $query = "SELECT COUNT(*) as total FROM orders WHERE $previousDateCondition";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    $previousOrders = (int)$result['total'];
    
    // Calcul croissance commandes
    $stats['recentStats']['ordersGrowth'] = $previousOrders > 0 ? 
        (($stats['totalOrders'] - $previousOrders) / $previousOrders) * 100 : 0;
    
    // Nombre total de produits
    $query = "SELECT COUNT(*) as total FROM products WHERE is_active = 1";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    $stats['totalProducts'] = (int)$result['total'];
    
    // Nombre d'utilisateurs
    $query = "SELECT COUNT(*) as total FROM users WHERE is_active = 1 AND $dateCondition";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    $stats['totalUsers'] = (int)$result['total'];
    
    // Utilisateurs période précédente
    $query = "SELECT COUNT(*) as total FROM users WHERE is_active = 1 AND $previousDateCondition";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    $previousUsers = (int)$result['total'];
    
    // Calcul croissance utilisateurs
    $stats['recentStats']['usersGrowth'] = $previousUsers > 0 ? 
        (($stats['totalUsers'] - $previousUsers) / $previousUsers) * 100 : 0;
    
    // Chiffre d'affaires mensuel (12 derniers mois)
    $query = "SELECT 
                MONTH(created_at) as month,
                COALESCE(SUM(total_amount), 0) as revenue
              FROM orders 
              WHERE payment_status = 'paid' 
                AND DATE(created_at) >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
              GROUP BY MONTH(created_at)
              ORDER BY MONTH(created_at)";
    
    $stmt = $db->prepare($query);
    $stmt->execute();
    
    $monthlyRevenue = array_fill(0, 12, 0);
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $monthlyRevenue[$row['month'] - 1] = (float)$row['revenue'];
    }
    $stats['monthlyRevenue'] = $monthlyRevenue;
    
    // Commandes mensuelles (12 derniers mois)
    $query = "SELECT 
                MONTH(created_at) as month,
                COUNT(*) as orders
              FROM orders 
              WHERE DATE(created_at) >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
              GROUP BY MONTH(created_at)
              ORDER BY MONTH(created_at)";
    
    $stmt = $db->prepare($query);
    $stmt->execute();
    
    $monthlyOrders = array_fill(0, 12, 0);
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $monthlyOrders[$row['month'] - 1] = (int)$row['orders'];
    }
    $stats['monthlyOrders'] = $monthlyOrders;
    
    // Top produits
    $query = "SELECT 
                p.name,
                SUM(oi.quantity) as sales,
                SUM(oi.total_price) as revenue
              FROM order_items oi
              JOIN products p ON oi.product_id = p.id
              JOIN orders o ON oi.order_id = o.id
              WHERE o.payment_status = 'paid' AND $dateCondition
              GROUP BY p.id, p.name
              ORDER BY revenue DESC
              LIMIT 10";
    
    $stmt = $db->prepare($query);
    $stmt->execute();
    
    $topProducts = array();
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $topProducts[] = array(
            "name" => $row['name'],
            "sales" => (int)$row['sales'],
            "revenue" => (float)$row['revenue']
        );
    }
    $stats['topProducts'] = $topProducts;
    
    http_response_code(200);
    echo json_encode($stats);
    
} catch(PDOException $exception) {
    http_response_code(500);
    echo json_encode(array("message" => "Erreur: " . $exception->getMessage()));
}
?>