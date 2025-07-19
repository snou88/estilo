<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->current_password) && !empty($data->new_password)) {
    
    try {
        // Pour cet exemple, on utilise un admin par défaut
        // Dans un vrai système, vous devriez récupérer l'ID de l'admin connecté
        $adminId = 1;
        
        // Vérifier le mot de passe actuel
        $query = "SELECT password FROM admin_users WHERE id = :id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':id', $adminId);
        $stmt->execute();
        
        $admin = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if($admin && password_verify($data->current_password, $admin['password'])) {
            // Hasher le nouveau mot de passe
            $newPasswordHash = password_hash($data->new_password, PASSWORD_DEFAULT);
            
            // Mettre à jour le mot de passe
            $query = "UPDATE admin_users SET password = :password, updated_at = NOW() WHERE id = :id";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':password', $newPasswordHash);
            $stmt->bindParam(':id', $adminId);
            
            if($stmt->execute()) {
                http_response_code(200);
                echo json_encode(array("message" => "Mot de passe modifié avec succès."));
            } else {
                http_response_code(500);
                echo json_encode(array("message" => "Erreur lors de la modification du mot de passe."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Mot de passe actuel incorrect."));
        }
        
    } catch(PDOException $exception) {
        http_response_code(500);
        echo json_encode(array("message" => "Erreur: " . $exception->getMessage()));
    }
    
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Données incomplètes."));
}
?>