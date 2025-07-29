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
    // Include database configuration
    $configFile = dirname(__DIR__) . '/config/db_config.php';
    if (!file_exists($configFile)) {
        sendResponse(false, null, 'Database configuration file not found', 500);
    }
    
    require_once $configFile;
    
    // Verify database connection
    if (!isset($pdo) || !($pdo instanceof PDO)) {
        sendResponse(false, null, 'Database connection failed', 500);
    }
    
    // Check if table exists, create if not
    $tableCheck = $pdo->query("SHOW TABLES LIKE 'admins'");
    if ($tableCheck->rowCount() == 0) {
        try {
            $pdo->exec("CREATE TABLE IF NOT EXISTS `admins` (
                `id` int(11) NOT NULL AUTO_INCREMENT,
                `full_name` varchar(100) NOT NULL,
                `email` varchar(100) NOT NULL,
                `password` varchar(255) NOT NULL,
                `created_at` datetime NOT NULL DEFAULT current_timestamp(),
                `token` varchar(255) DEFAULT NULL,
                PRIMARY KEY (`id`),
                UNIQUE KEY `email` (`email`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
            
            // Insert default admin if table was just created
            $defaultPass = password_hash('admin123', PASSWORD_DEFAULT);
            $pdo->exec("INSERT INTO `admins` (`full_name`, `email`, `password`) 
                      VALUES ('admin', 'admin@estilo.com', '$defaultPass')");
                      
        } catch (PDOException $e) {
            sendResponse(false, null, 'Error creating table: ' . $e->getMessage(), 500);
        }
    }
    
    // Fetch all admins (using full_name instead of name, and excluding password)
    $stmt = $pdo->query('SELECT id, full_name, email, created_at FROM admins ORDER BY created_at DESC');
    $admins = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Add a flag for the main admin (id=1)
    $admins = array_map(function($admin) {
        $admin['is_main_admin'] = ($admin['id'] === 1);
        return $admin;
    }, $admins);
    
    sendResponse(true, ['admins' => $admins]);
    
} catch (PDOException $e) {
    sendResponse(false, null, 'Database error: ' . $e->getMessage(), 500);
} catch (Exception $e) {
    sendResponse(false, null, 'Server error: ' . $e->getMessage(), 500);
}
