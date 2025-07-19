<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->to) && !empty($data->subject) && !empty($data->message)) {
    
    $to = $data->to;
    $subject = $data->subject;
    $message = $data->message;
    
    // Headers pour l'email
    $headers = array(
        'From' => 'admin@estilo.com',
        'Reply-To' => 'admin@estilo.com',
        'Content-Type' => 'text/plain; charset=UTF-8'
    );
    
    $headerString = '';
    foreach ($headers as $key => $value) {
        $headerString .= $key . ': ' . $value . "\r\n";
    }
    
    // Tentative d'envoi de l'email
    if (mail($to, $subject, $message, $headerString)) {
        // Log de la réponse envoyée (optionnel)
        include_once '../../config/database.php';
        
        try {
            $database = new Database();
            $db = $database->getConnection();
            
            $query = "INSERT INTO admin_replies (original_message_id, reply_to, subject, message, sent_at) 
                     VALUES (:original_id, :reply_to, :subject, :message, NOW())";
            
            $stmt = $db->prepare($query);
            $stmt->bindParam(':original_id', $data->original_message_id);
            $stmt->bindParam(':reply_to', $to);
            $stmt->bindParam(':subject', $subject);
            $stmt->bindParam(':message', $message);
            $stmt->execute();
            
        } catch(PDOException $exception) {
            // Log l'erreur mais continue
            error_log("Erreur lors de l'enregistrement de la réponse: " . $exception->getMessage());
        }
        
        http_response_code(200);
        echo json_encode(array("message" => "Réponse envoyée avec succès."));
    } else {
        http_response_code(500);
        echo json_encode(array("message" => "Erreur lors de l'envoi de l'email."));
    }
    
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Données incomplètes."));
}
?>