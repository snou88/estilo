<?php
session_start();
require_once '../config/db_config.php';

// Liste des pages autorisées sans authentification
$allowed_pages = ['login.php', 'register.php'];
$current_page = basename($_SERVER['PHP_SELF']);

// Vérifier si la page actuelle nécessite une authentification
if (!in_array($current_page, $allowed_pages)) {
    // Vérifier si l'utilisateur est connecté
    if (!isset($_SESSION['admin_id'])) {
        // Rediriger vers la page de login avec le chemin actuel
        $redirect_url = 'login.php?redirect=' . urlencode($_SERVER['REQUEST_URI']);
        header('Location: ' . $redirect_url);
        exit;
    }
    
    // Vérifier si l'admin existe toujours dans la base de données
    $stmt = $pdo->prepare("SELECT id FROM admins WHERE id = ?");
    $stmt->execute([$_SESSION['admin_id']]);
    if (!$stmt->fetch()) {
        // Si l'admin n'existe plus, déconnecter
        session_destroy();
        header('Location: login.php');
        exit;
    }
}

// Fonction pour vérifier les permissions
function checkPermission($permission) {
    // Pour l'instant, tous les admins ont toutes les permissions
    return true;
}

// Fonction pour vérifier si l'admin est super admin
function isAdminSuperAdmin() {
    // Pour l'instant, tous les admins sont super admins
    return true;
}
?>
