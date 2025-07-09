<?php
// Configuration des headers CORS
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Gérer la requête OPTIONS (prévolée)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Max-Age: 3600');
    exit(0);
}

// Rediriger vers le fichier login.php pour les requêtes POST
if ($_SERVER['REQUEST_METHOD'] === 'POST' && strpos($_SERVER['REQUEST_URI'], 'login.php') !== false) {
    require_once __DIR__ . '/login.php';
    exit;
}

// Pour les autres requêtes, montrer la page d'accueil
?>
<!DOCTYPE html>
<html>
<head>
    <title>Admin Panel</title>
</head>
<body>
    <h1>Admin Panel</h1>
    <p>API endpoint: http://localhost/admin/login.php</p>
</body>
</html>
