<?php
// admin/verify_admin_token.php
// Usage: include this file at the top of any admin-protected PHP script

require_once '../config/db_config.php';

function get_admin_token() {
    // Try Authorization header (most servers)
    if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        return trim($_SERVER['HTTP_AUTHORIZATION']);
    }
    // Try Apache-specific
    if (function_exists('apache_request_headers')) {
        $headers = apache_request_headers();
        if (isset($headers['Authorization'])) {
            return trim($headers['Authorization']);
        }
    }
    // Try REDIRECT_HTTP_AUTHORIZATION (some Apache configs)
    if (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
        return trim($_SERVER['REDIRECT_HTTP_AUTHORIZATION']);
    }
    // Try POST or GET
    if (isset($_POST['token'])) return $_POST['token'];
    if (isset($_GET['token'])) return $_GET['token'];
    return null;
}

$token = get_admin_token();
// Remove 'Bearer ' prefix if present
if ($token && stripos($token, 'Bearer ') === 0) {
    $token = substr($token, 7);
}
if (!$token) {
    http_response_code(401);
    echo json_encode(['error' => 'Token manquant']);
    exit;
}

// Check token in DB
$stmt = $pdo->prepare('SELECT id, email FROM admins WHERE token = :token');
$stmt->execute(['token' => $token]);
$admin = $stmt->fetch();

if (!$admin) {
    http_response_code(401);
    echo json_encode(['error' => 'Token invalide']);
    exit;
}

$admin_id = $admin['id'];
$admin_email = $admin['email'];
// Now $admin_id and $admin_email are available for use in the script 