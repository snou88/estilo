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
        try {
            $query = "SELECT setting_key, setting_value FROM site_settings";
            $stmt = $db->prepare($query);
            $stmt->execute();
            
            $settings = array(
                'site_name' => 'Estilo',
                'site_description' => 'Boutique de mode en ligne',
                'site_email' => 'contact@estilo.com',
                'site_phone' => '+33 1 23 45 67 89',
                'site_address' => '123 Rue de la Mode, 75001 Paris, France',
                'currency' => 'EUR',
                'tax_rate' => 20,
                'shipping_cost' => 5.99,
                'free_shipping_threshold' => 50,
                'maintenance_mode' => false,
                'email_notifications' => true,
                'sms_notifications' => false
            );
            
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $key = $row['setting_key'];
                $value = $row['setting_value'];
                
                // Conversion des types
                if (in_array($key, ['tax_rate', 'shipping_cost', 'free_shipping_threshold'])) {
                    $settings[$key] = (float)$value;
                } elseif (in_array($key, ['maintenance_mode', 'email_notifications', 'sms_notifications'])) {
                    $settings[$key] = (bool)$value;
                } else {
                    $settings[$key] = $value;
                }
            }
            
            http_response_code(200);
            echo json_encode(array("settings" => $settings));
            
        } catch(PDOException $exception) {
            http_response_code(500);
            echo json_encode(array("message" => "Erreur: " . $exception->getMessage()));
        }
        break;
        
    case 'PUT':
        $data = json_decode(file_get_contents("php://input"));
        
        try {
            $db->beginTransaction();
            
            foreach ($data as $key => $value) {
                $query = "INSERT INTO site_settings (setting_key, setting_value) 
                         VALUES (:key, :value) 
                         ON DUPLICATE KEY UPDATE setting_value = :value";
                
                $stmt = $db->prepare($query);
                $stmt->bindParam(':key', $key);
                $stmt->bindParam(':value', $value);
                $stmt->execute();
            }
            
            $db->commit();
            
            http_response_code(200);
            echo json_encode(array("message" => "Paramètres sauvegardés avec succès."));
            
        } catch(PDOException $exception) {
            $db->rollback();
            http_response_code(500);
            echo json_encode(array("message" => "Erreur: " . $exception->getMessage()));
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(array("message" => "Méthode non autorisée."));
        break;
}
?>