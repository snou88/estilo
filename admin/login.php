<?php
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
session_start();

// Charger la configuration de la BDD
require_once '../config/db_config.php';

try {
    // Récupérer et nettoyer les données
    $email    = isset($_POST['email'])    ? trim($_POST['email'])    : '';
    $password = isset($_POST['password']) ? $_POST['password']        : '';

    if (empty($email) || empty($password)) {
        http_response_code(400);
        echo json_encode(['error' => 'Email ou mot de passe manquant']);
        exit;
    }

    // Préparer la requête pour récupérer l'utilisateur
    $stmt = $pdo->prepare('SELECT id, email, password, token FROM admins WHERE email = :email');
    $stmt->execute(['email' => $email]);
    $user = $stmt->fetch();

    if ($user && password_verify($password, $user['password'])) {
        // Authentification réussie : retourner le token
        http_response_code(200);
        echo json_encode(['token' => $user['token']]);
        exit;
    } else {
        // Échec d'authentification
        http_response_code(401);
        echo json_encode(['error' => 'Email ou mot de passe incorrect']);
        exit;
    }

} catch (PDOException $e) {
    // En cas d'erreur de BDD
    http_response_code(500);
    echo json_encode(['error' => 'Erreur serveur : ' . $e->getMessage()]);
    exit;
}