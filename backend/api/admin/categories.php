<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        try {
            $query = "SELECT id, name, description, is_active FROM categories WHERE is_active = 1 ORDER BY name";
            $stmt = $db->prepare($query);
            $stmt->execute();
            
            $categories = array();
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $categories[] = array(
                    "id" => (int)$row['id'],
                    "name" => $row['name'],
                    "description" => $row['description'],
                    "is_active" => (bool)$row['is_active']
                );
            }
            
            http_response_code(200);
            echo json_encode(array("categories" => $categories));
            
        } catch(PDOException $exception) {
            http_response_code(500);
            echo json_encode(array("message" => "Erreur: " . $exception->getMessage()));
        }
        break;
        
    case 'POST':
        // Créer une nouvelle catégorie
        $data = json_decode(file_get_contents("php://input"));
        
        if(!empty($data->name)) {
            try {
                $query = "INSERT INTO categories (name, description) VALUES (:name, :description)";
                $stmt = $db->prepare($query);
                
                $stmt->bindParam(":name", $data->name);
                $stmt->bindParam(":description", $data->description);
                
                if($stmt->execute()) {
                    http_response_code(201);
                    echo json_encode(array("message" => "Catégorie créée avec succès."));
                } else {
                    http_response_code(503);
                    echo json_encode(array("message" => "Impossible de créer la catégorie."));
                }
            } catch(PDOException $exception) {
                http_response_code(500);
                echo json_encode(array("message" => "Erreur: " . $exception->getMessage()));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Nom de catégorie requis."));
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(array("message" => "Méthode non autorisée."));
        break;
}
?>