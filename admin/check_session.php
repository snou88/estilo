<?php
// Démarrer la session
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once 'session_manager.php';

// Pages autorisées sans connexion
$allowed_pages = [
    'login.php',
    'register.php',
    'forgot-password.php',
    'reset-password.php'
];

// Vérifier si la page est autorisée
$current_page = basename($_SERVER['PHP_SELF']);
if (!in_array($current_page, $allowed_pages)) {
    checkAuth();
}

// Vérifier si l'admin existe toujours
try {
    // Vérifier si la connexion PDO existe déjà
    if (!isset($pdo)) {
        require_once '../config/db_config.php';
    }
    
    $stmt = $pdo->prepare("SELECT id, email FROM admins WHERE id = ?");
    $stmt->execute([$_SESSION['admin_id']]);
    $admin = $stmt->fetch();
    
    if (!$admin) {
        // Si l'admin n'existe plus, déconnecter
        session_destroy();
        header('Location: login.php');
        exit;
    }
    
    // Mettre à jour le nom de l'admin dans la session
    $_SESSION['admin_email'] = $admin['email'];
    
} catch (PDOException $e) {
    // En cas d'erreur de connexion à la base de données, déconnecter
    session_destroy();
    header('Location: login.php');
    exit;
}

// Vérifier le timeout (30 minutes)
if (isset($_SESSION['last_activity']) && (time() - $_SESSION['last_activity'] > 1800)) {
    session_destroy();
    header('Location: login.php');
    exit;
}

// Mettre à jour l'activité
$_SESSION['last_activity'] = time();

// Vérifier si l'utilisateur essaie d'accéder directement à la page
if (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest') {
    // Si c'est une requête AJAX, renvoyer une erreur
    header('HTTP/1.1 401 Unauthorized');
    echo json_encode(['error' => 'Non autorisé']);
    exit;
}

// Vérifier l'origine de la requête
if (isset($_SERVER['HTTP_REFERER'])) {
    $referer = parse_url($_SERVER['HTTP_REFERER']);
    if ($referer['host'] !== $_SERVER['HTTP_HOST']) {
        header('Location: login.php');
        exit;
    }
}
?>
