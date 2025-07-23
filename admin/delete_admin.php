<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set CORS headers
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, OPTIONS");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header('Content-Type: application/json');

// Function to send JSON response
function sendResponse($success, $data = null, $error = null, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode([
        'success' => $success,
        'data' => $data,
        'error' => $error
    ]);
    exit();
}

try {
    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Validate input
    if (!isset($input['id']) || !is_numeric($input['id'])) {
        sendResponse(false, null, 'ID administrateur invalide', 400);
    }
    
    $adminId = (int)$input['id'];
    
    // Prevent deleting the main admin (ID 1)
    if ($adminId === 1) {
        sendResponse(false, null, 'Impossible de supprimer l\'administrateur principal', 400);
    }
    
    // Include database configuration
    require_once dirname(__DIR__) . '/config/db_config.php';
    
    // Check if admin exists
    $stmt = $pdo->prepare('SELECT id FROM admins WHERE id = ?');
    $stmt->execute([$adminId]);
    
    if ($stmt->rowCount() === 0) {
        sendResponse(false, null, 'Administrateur non trouvé', 404);
    }
    
    // Delete the admin
    $stmt = $pdo->prepare('DELETE FROM admins WHERE id = ?');
    $result = $stmt->execute([$adminId]);
    
    if ($result) {
        sendResponse(true, ['message' => 'Administrateur supprimé avec succès']);
    } else {
        sendResponse(false, null, 'Erreur lors de la suppression de l\'administrateur', 500);
    }
    
} catch (PDOException $e) {
    sendResponse(false, null, 'Database error: ' . $e->getMessage(), 500);
} catch (Exception $e) {
    sendResponse(false, null, 'Server error: ' . $e->getMessage(), 500);
}
