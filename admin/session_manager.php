<?php
// Démarrer la session
session_start();

// Configuration de la session
ini_set('session.cookie_httponly', 1);
ini_set('session.use_only_cookies', 1);
ini_set('session.cookie_secure', false); // Désactivé en local
ini_set('session.cookie_samesite', 'Lax');
ini_set('session.gc_maxlifetime', 1800); // 30 minutes

// Vérifier le timeout
if (isset($_SESSION['last_activity']) && (time() - $_SESSION['last_activity'] > 1800)) {
    session_destroy();
    header('Location: login.php');
    exit;
}

// Mettre à jour l'activité
$_SESSION['last_activity'] = time();

// Vérifier l'origine de la requête uniquement en production
if (isset($_SERVER['HTTP_REFERER']) && !in_array($_SERVER['REMOTE_ADDR'], ['127.0.0.1', '::1'])) {
    $referer = parse_url($_SERVER['HTTP_REFERER']);
    if ($referer['host'] !== $_SERVER['HTTP_HOST']) {
        header('Location: login.php');
        exit;
    }
}

// Vérifier si c'est une requête AJAX
if (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest') {
    if (!isset($_SESSION['admin_id'])) {
        header('HTTP/1.1 401 Unauthorized');
        echo json_encode(['error' => 'Non autorisé']);
        exit;
    }
}

// Fonction pour vérifier l'authentification
function checkAuth() {
    if (!isset($_SESSION['admin_id'])) {
        header('Location: login.php');
        exit;
    }
}

// Fonction pour détruire la session
function destroySession() {
    session_destroy();
    $_SESSION = array();
    setcookie(session_name(), '', time()-3600, '/');
}

// Fonction pour obtenir les informations de l'admin
function getAdminInfo() {
    if (!isset($_SESSION['admin_id'])) {
        return null;
    }
    
    require_once '../config/db_config.php';
    try {
        $stmt = $pdo->prepare("SELECT id, email, full_name FROM admins WHERE id = ?");
        $stmt->execute([$_SESSION['admin_id']]);
        return $stmt->fetch();
    } catch (PDOException $e) {
        error_log("Erreur lors de la récupération des informations admin: " . $e->getMessage());
        return null;
    }
}
?>
