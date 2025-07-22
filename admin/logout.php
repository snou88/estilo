<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

header('Content-Type: application/json');

// Si tu utilises les sessions PHP pour l'admin :
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
if (isset($_SESSION['admin'])) {
    unset($_SESSION['admin']);
}
session_destroy();

// Côté front, il faut aussi supprimer le token du localStorage

echo json_encode(['success' => true, 'message' => 'Déconnexion réussie']); 