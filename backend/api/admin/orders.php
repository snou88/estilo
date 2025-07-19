<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, PUT");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        if(isset($_GET['id'])) {
            // Récupérer les détails d'une commande
            try {
                $orderId = $_GET['id'];
                
                // Informations de la commande
                $query = "SELECT 
                            o.*,
                            CONCAT(u.first_name, ' ', u.last_name) as customer_name,
                            u.email as customer_email
                          FROM orders o
                          LEFT JOIN users u ON o.user_id = u.id
                          WHERE o.id = :id";
                
                $stmt = $db->prepare($query);
                $stmt->bindParam(':id', $orderId);
                $stmt->execute();
                
                $order = $stmt->fetch(PDO::FETCH_ASSOC);
                
                if($order) {
                    // Articles de la commande
                    $query = "SELECT 
                                oi.*,
                                p.name as product_name
                              FROM order_items oi
                              LEFT JOIN products p ON oi.product_id = p.id
                              WHERE oi.order_id = :order_id";
                    
                    $stmt = $db->prepare($query);
                    $stmt->bindParam(':order_id', $orderId);
                    $stmt->execute();
                    
                    $items = array();
                    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                        $items[] = array(
                            "product_name" => $row['product_name'],
                            "quantity" => (int)$row['quantity'],
                            "size" => $row['size'],
                            "color" => $row['color'],
                            "unit_price" => (float)$row['unit_price'],
                            "total_price" => (float)$row['total_price']
                        );
                    }
                    
                    $orderDetails = array(
                        "id" => (int)$order['id'],
                        "customer_name" => $order['customer_name'],
                        "customer_email" => $order['customer_email'],
                        "total_amount" => (float)$order['total_amount'],
                        "status" => $order['status'],
                        "payment_status" => $order['payment_status'],
                        "shipping_address" => $order['shipping_address'],
                        "billing_address" => $order['billing_address'],
                        "created_at" => $order['created_at'],
                        "items" => $items
                    );
                    
                    http_response_code(200);
                    echo json_encode($orderDetails);
                } else {
                    http_response_code(404);
                    echo json_encode(array("message" => "Commande non trouvée."));
                }
                
            } catch(PDOException $exception) {
                http_response_code(500);
                echo json_encode(array("message" => "Erreur: " . $exception->getMessage()));
            }
        } else {
            // Récupérer toutes les commandes
            try {
                $query = "SELECT 
                            o.id,
                            o.total_amount,
                            o.status,
                            o.payment_status,
                            o.created_at,
                            CONCAT(u.first_name, ' ', u.last_name) as customer_name,
                            u.email as customer_email,
                            COUNT(oi.id) as items_count
                          FROM orders o
                          LEFT JOIN users u ON o.user_id = u.id
                          LEFT JOIN order_items oi ON o.id = oi.order_id
                          GROUP BY o.id
                          ORDER BY o.created_at DESC";
                
                $stmt = $db->prepare($query);
                $stmt->execute();
                
                $orders = array();
                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    $orders[] = array(
                        "id" => (int)$row['id'],
                        "customer_name" => $row['customer_name'] ?: 'Client supprimé',
                        "customer_email" => $row['customer_email'] ?: '',
                        "total_amount" => (float)$row['total_amount'],
                        "status" => $row['status'],
                        "payment_status" => $row['payment_status'],
                        "created_at" => $row['created_at'],
                        "items_count" => (int)$row['items_count']
                    );
                }
                
                http_response_code(200);
                echo json_encode(array("orders" => $orders));
                
            } catch(PDOException $exception) {
                http_response_code(500);
                echo json_encode(array("message" => "Erreur: " . $exception->getMessage()));
            }
        }
        break;
        
    case 'PUT':
        // Mettre à jour le statut d'une commande
        if(isset($_GET['id'])) {
            $data = json_decode(file_get_contents("php://input"));
            
            if(!empty($data->status)) {
                try {
                    $query = "UPDATE orders SET status = :status, updated_at = CURRENT_TIMESTAMP WHERE id = :id";
                    $stmt = $db->prepare($query);
                    
                    $stmt->bindParam(':status', $data->status);
                    $stmt->bindParam(':id', $_GET['id']);
                    
                    if($stmt->execute()) {
                        http_response_code(200);
                        echo json_encode(array("message" => "Statut mis à jour avec succès."));
                    } else {
                        http_response_code(503);
                        echo json_encode(array("message" => "Impossible de mettre à jour le statut."));
                    }
                } catch(PDOException $exception) {
                    http_response_code(500);
                    echo json_encode(array("message" => "Erreur: " . $exception->getMessage()));
                }
            } else {
                http_response_code(400);
                echo json_encode(array("message" => "Statut requis."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "ID de commande requis."));
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(array("message" => "Méthode non autorisée."));
        break;
}
?>