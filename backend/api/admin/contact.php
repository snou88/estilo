<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        try {
            $query = "SELECT 
                        id, name, email, subject, message, is_read, created_at
                      FROM contact_messages 
                      ORDER BY created_at DESC";
            
            $stmt = $db->prepare($query);
            $stmt->execute();
            
            $messages = array();
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $messages[] = array(
                    "id" => (int)$row['id'],
                    "name" => $row['name'],
                    "email" => $row['email'],
                    "subject" => $row['subject'],
                    "message" => $row['message'],
                    "is_read" => (bool)$row['is_read'],
                    "created_at" => $row['created_at']
                );
            }
            
            http_response_code(200);
            echo json_encode(array("messages" => $messages));
            
        } catch(PDOException $exception) {
            http_response_code(500);
            echo json_encode(array("message" => "Erreur: " . $exception->getMessage()));
        }
        break;
        
    case 'PUT':
        // Marquer un message comme lu
        if(isset($_GET['id'])) {
            $data = json_decode(file_get_contents("php://input"));
            
            try {
                $query = "UPDATE contact_messages SET is_read = :is_read WHERE id = :id";
                $stmt = $db->prepare($query);
                
                $stmt->bindParam(':is_read', $data->is_read, PDO::PARAM_BOOL);
                $stmt->bindParam(':id', $_GET['id']);
                
                if($stmt->execute()) {
                    http_response_code(200);
                    echo json_encode(array("message" => "Message mis à jour avec succès."));
                } else {
                    http_response_code(503);
                    echo json_encode(array("message" => "Impossible de mettre à jour le message."));
                }
            } catch(PDOException $exception) {
                http_response_code(500);
                echo json_encode(array("message" => "Erreur: " . $exception->getMessage()));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "ID du message requis."));
        }
        break;
        
    case 'DELETE':
        // Supprimer un message
        if(isset($_GET['id'])) {
            try {
                $query = "DELETE FROM contact_messages WHERE id = :id";
                $stmt = $db->prepare($query);
                $stmt->bindParam(':id', $_GET['id']);
                
                if($stmt->execute()) {
                    http_response_code(200);
                    echo json_encode(array("message" => "Message supprimé avec succès."));
                } else {
                    http_response_code(503);
                    echo json_encode(array("message" => "Impossible de supprimer le message."));
                }
            } catch(PDOException $exception) {
                http_response_code(500);
                echo json_encode(array("message" => "Erreur: " . $exception->getMessage()));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "ID du message requis."));
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(array("message" => "Méthode non autorisée."));
        break;
}
?>