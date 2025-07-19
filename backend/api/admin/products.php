<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../../config/database.php';
include_once '../../models/Product.php';

$database = new Database();
$db = $database->getConnection();
$product = new Product($db);

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        if(isset($_GET['id'])) {
            // Récupérer un produit spécifique
            $product->id = $_GET['id'];
            $product->readOne();
            
            if($product->name != null) {
                $product_arr = array(
                    "id" => $product->id,
                    "name" => $product->name,
                    "description" => $product->description,
                    "price" => $product->price,
                    "category_name" => $product->category_name,
                    "image_url" => $product->image_url,
                    "sizes" => json_decode($product->sizes),
                    "colors" => json_decode($product->colors),
                    "stock_quantity" => $product->stock_quantity,
                    "is_active" => $product->is_active,
                    "created_at" => $product->created_at
                );
                
                http_response_code(200);
                echo json_encode($product_arr);
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "Produit non trouvé."));
            }
        } else {
            // Récupérer tous les produits pour l'admin
            $query = "SELECT 
                        p.id, p.name, p.description, p.price, 
                        p.image_url, p.sizes, p.colors, p.stock_quantity,
                        p.is_active, p.created_at,
                        c.name as category_name
                      FROM products p
                      LEFT JOIN categories c ON p.category_id = c.id
                      ORDER BY p.created_at DESC";
            
            $stmt = $db->prepare($query);
            $stmt->execute();
            
            $products = array();
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $products[] = array(
                    "id" => (int)$row['id'],
                    "name" => $row['name'],
                    "description" => $row['description'],
                    "price" => (float)$row['price'],
                    "category_name" => $row['category_name'],
                    "image_url" => $row['image_url'],
                    "sizes" => json_decode($row['sizes']),
                    "colors" => json_decode($row['colors']),
                    "stock_quantity" => (int)$row['stock_quantity'],
                    "is_active" => (bool)$row['is_active'],
                    "created_at" => $row['created_at']
                );
            }
            
            http_response_code(200);
            echo json_encode(array("products" => $products));
        }
        break;
        
    case 'POST':
        // Créer un nouveau produit
        $data = json_decode(file_get_contents("php://input"));
        
        if(!empty($data->name) && !empty($data->price) && !empty($data->category_id)) {
            $product->name = $data->name;
            $product->description = $data->description;
            $product->price = $data->price;
            $product->category_id = $data->category_id;
            $product->image_url = $data->image_url;
            $product->stock_quantity = $data->stock_quantity;
            $product->sizes = json_encode(explode(',', $data->sizes ?? ''));
            $product->colors = json_encode(explode(',', $data->colors ?? ''));
            
            if($product->create()) {
                http_response_code(201);
                echo json_encode(array("message" => "Produit créé avec succès."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Impossible de créer le produit."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Données incomplètes."));
        }
        break;
        
    case 'PUT':
        // Mettre à jour un produit
        $data = json_decode(file_get_contents("php://input"));
        
        if(isset($_GET['id']) && !empty($data->name)) {
            $product->id = $_GET['id'];
            $product->name = $data->name;
            $product->description = $data->description;
            $product->price = $data->price;
            $product->category_id = $data->category_id;
            $product->image_url = $data->image_url;
            $product->stock_quantity = $data->stock_quantity;
            $product->sizes = json_encode(explode(',', $data->sizes ?? ''));
            $product->colors = json_encode(explode(',', $data->colors ?? ''));
            
            if($product->update()) {
                http_response_code(200);
                echo json_encode(array("message" => "Produit mis à jour avec succès."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Impossible de mettre à jour le produit."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Données incomplètes."));
        }
        break;
        
    case 'DELETE':
        // Supprimer un produit (soft delete)
        if(isset($_GET['id'])) {
            $product->id = $_GET['id'];
            
            if($product->delete()) {
                http_response_code(200);
                echo json_encode(array("message" => "Produit supprimé avec succès."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Impossible de supprimer le produit."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "ID du produit requis."));
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(array("message" => "Méthode non autorisée."));
        break;
}
?>