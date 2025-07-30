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
    // Statistiques générales
    $stats = [];
    
    // Total des commandes
    $stmt = $pdo->query("SELECT COUNT(*) as total_orders FROM orders");
    $stats['total_orders'] = $stmt->fetch(PDO::FETCH_ASSOC)['total_orders'];
    
    // Total des produits
    $stmt = $pdo->query("SELECT COUNT(*) as total_products FROM products");
    $stats['total_products'] = $stmt->fetch(PDO::FETCH_ASSOC)['total_products'];
    
    // Revenu total
    $stmt = $pdo->query("SELECT SUM(total_amount) as total_revenue FROM orders WHERE status != 'cancelled'");
    $stats['total_revenue'] = (float)$stmt->fetch(PDO::FETCH_ASSOC)['total_revenue'] ?? 0;
    
    // Revenu du mois en cours
    $stmt = $pdo->query("SELECT SUM(total_amount) as monthly_revenue FROM orders WHERE status != 'cancelled' AND MONTH(created_at) = MONTH(CURRENT_DATE()) AND YEAR(created_at) = YEAR(CURRENT_DATE())");
    $stats['monthly_revenue'] = (float)$stmt->fetch(PDO::FETCH_ASSOC)['monthly_revenue'] ?? 0;
    
    // Commandes du mois en cours
    $stmt = $pdo->query("SELECT COUNT(*) as monthly_orders FROM orders WHERE MONTH(created_at) = MONTH(CURRENT_DATE()) AND YEAR(created_at) = YEAR(CURRENT_DATE())");
    $stats['monthly_orders'] = $stmt->fetch(PDO::FETCH_ASSOC)['monthly_orders'];
    
    // Commandes du mois précédent (pour calculer la tendance)
    $stmt = $pdo->query("SELECT COUNT(*) as last_month_orders FROM orders WHERE MONTH(created_at) = MONTH(DATE_SUB(CURRENT_DATE(), INTERVAL 1 MONTH)) AND YEAR(created_at) = YEAR(DATE_SUB(CURRENT_DATE(), INTERVAL 1 MONTH))");
    $lastMonthOrders = $stmt->fetch(PDO::FETCH_ASSOC)['last_month_orders'];
    
    // Calcul de la tendance des commandes
    $stats['orders_trend'] = $lastMonthOrders > 0 ? round((($stats['monthly_orders'] - $lastMonthOrders) / $lastMonthOrders) * 100, 1) : 0;
    
    // Revenu du mois précédent
    $stmt = $pdo->query("SELECT SUM(total_amount) as last_month_revenue FROM orders WHERE status != 'cancelled' AND MONTH(created_at) = MONTH(DATE_SUB(CURRENT_DATE(), INTERVAL 1 MONTH)) AND YEAR(created_at) = YEAR(DATE_SUB(CURRENT_DATE(), INTERVAL 1 MONTH))");
    $lastMonthRevenue = (float)$stmt->fetch(PDO::FETCH_ASSOC)['last_month_revenue'] ?? 0;
    
    // Calcul de la tendance du revenu
    $stats['revenue_trend'] = $lastMonthRevenue > 0 ? round((($stats['monthly_revenue'] - $lastMonthRevenue) / $lastMonthRevenue) * 100, 1) : 0;
    
    // Meilleur vendeur (produit le plus commandé)
    $stmt = $pdo->query("
        SELECT p.name, SUM(oi.quantity) as total_quantity
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        JOIN orders o ON oi.order_id = o.id
        WHERE o.status != 'cancelled'
        GROUP BY oi.product_id, p.name
        ORDER BY total_quantity DESC
        LIMIT 1
    ");
    $bestSeller = $stmt->fetch(PDO::FETCH_ASSOC);
    $stats['best_seller'] = $bestSeller ? [
        'name' => $bestSeller['name'],
        'quantity' => (int)$bestSeller['total_quantity']
    ] : ['name' => 'Aucun', 'quantity' => 0];
    
    // Statistiques par statut de commande
    $stmt = $pdo->query("
        SELECT status, COUNT(*) as count
        FROM orders
        GROUP BY status
    ");
    $statusStats = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $stats['status_distribution'] = [];
    foreach ($statusStats as $status) {
        $stats['status_distribution'][$status['status']] = (int)$status['count'];
    }
    
    // Données pour les graphiques (6 derniers mois)
    $stmt = $pdo->query("
        SELECT 
            DATE_FORMAT(created_at, '%Y-%m') as month,
            COUNT(*) as orders_count,
            SUM(total_amount) as revenue
        FROM orders
        WHERE created_at >= DATE_SUB(CURRENT_DATE(), INTERVAL 6 MONTH)
        GROUP BY DATE_FORMAT(created_at, '%Y-%m')
        ORDER BY month
    ");
    $chartData = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $stats['chart_data'] = [
        'labels' => [],
        'orders' => [],
        'revenue' => []
    ];
    
    foreach ($chartData as $data) {
        $month = date('M Y', strtotime($data['month'] . '-01'));
        $stats['chart_data']['labels'][] = $month;
        $stats['chart_data']['orders'][] = (int)$data['orders_count'];
        $stats['chart_data']['revenue'][] = (float)$data['revenue'];
    }
    
    echo json_encode([
        'success' => true,
        'statistics' => $stats
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur serveur: ' . $e->getMessage()]);
}
?> 