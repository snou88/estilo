<?php
session_start();
require_once '../config/db_config.php';

// Vérification de l'authentification
if (!isset($_SESSION['admin_id'])) {
    header('Location: login.php');
    exit;
}

// Gestion des commandes
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    switch ($_POST['action']) {
        case 'update_order':
            $stmt = $pdo->prepare("UPDATE orders SET status = ? WHERE id = ?");
            $stmt->execute([
                $_POST['status'],
                $_POST['order_id']
            ]);
            break;
    }
}

// Récupération des données
$orders = $pdo->query("
    SELECT o.*, 
           oi.product_id, 
           p.name as product_name, 
           oi.quantity, 
           oi.unit_price
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN products p ON oi.product_id = p.id
    ORDER BY o.created_at DESC
")->fetchAll();
?>
