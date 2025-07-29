<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set CORS headers
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

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
    if (!isset($input['username']) || !isset($input['email']) || !isset($input['password'])) {
        sendResponse(false, null, 'Tous les champs sont obligatoires', 400);
    }
    
    $username = trim($input['username']);
    $email = filter_var(trim($input['email']), FILTER_SANITIZE_EMAIL);
    $password = $input['password'];
    
    // Basic validation
    if (empty($username) || empty($email) || empty($password)) {
        sendResponse(false, null, 'Tous les champs sont obligatoires', 400);
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        sendResponse(false, null, 'Adresse email invalide', 400);
    }
    
    if (strlen($password) < 6) {
        sendResponse(false, null, 'Le mot de passe doit contenir au moins 6 caractères', 400);
    }
    
    // Include database configuration
    require_once dirname(__DIR__) . '/config/db_config.php';
    
    // Check if email already exists
    $stmt = $pdo->prepare('SELECT id FROM admins WHERE email = ?');
    $stmt->execute([$email]);
    if ($stmt->rowCount() > 0) {
        sendResponse(false, null, 'Cette adresse email est déjà utilisée', 400);
    }
    
    // Hash password
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    
    // Insert new admin
    $stmt = $pdo->prepare('INSERT INTO admins (username, email, password) VALUES (?, ?, ?)');
    $result = $stmt->execute([$username, $email, $hashedPassword]);
    
    if ($result) {
        sendResponse(true, ['message' => 'Administrateur ajouté avec succès']);
    } else {
        sendResponse(false, null, 'Erreur lors de l\'ajout de l\'administrateur', 500);
    }
    
} catch (PDOException $e) {
    sendResponse(false, null, 'Database error: ' . $e->getMessage(), 500);
} catch (Exception $e) {
    sendResponse(false, null, 'Server error: ' . $e->getMessage(), 500);
}
