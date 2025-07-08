<?php
session_start();
require_once '../config/db_config.php';

// Déconnexion
if (isset($_GET['logout'])) {
    session_destroy();
    header('Location: login.php');
    exit;
}

// Connexion
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'login') {
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';
    
    if (empty($email) || empty($password)) {
        $_SESSION['error'] = "Veuillez remplir tous les champs";
        header('Location: login.php');
        exit;
    }

    $stmt = $pdo->prepare("SELECT * FROM admins WHERE email = ?");
    $stmt->execute([$email]);
    $admin = $stmt->fetch();

    if ($admin && password_verify($password, $admin['password'])) {
        $_SESSION['admin_id'] = $admin['id'];
        $_SESSION['admin_name'] = $admin['full_name'];
        $_SESSION['last_activity'] = time();
        header('Location: dashboard.php');
        exit;
    } else {
        $_SESSION['error'] = "Email ou mot de passe incorrect";
        header('Location: login.php');
        exit;
    }
}

// Vérification de la session
if (isset($_SESSION['admin_id'])) {
    // Vérification de l'inactivité
    if (isset($_SESSION['last_activity']) && (time() - $_SESSION['last_activity'] > 1800)) { // 30 minutes
        session_destroy();
        header('Location: login.php');
        exit;
    }
    
    $_SESSION['last_activity'] = time();
}
?>
