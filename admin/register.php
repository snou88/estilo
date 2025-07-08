<?php
session_start();
require_once '../config/db_config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';
    $confirm_password = $_POST['confirm_password'] ?? '';
    $full_name = $_POST['full_name'] ?? '';
    
    $errors = [];
    
    // Validation des données
    if (empty($email) || empty($password) || empty($confirm_password) || empty($full_name)) {
        $errors[] = "Tous les champs sont obligatoires";
    }
    
    if ($password !== $confirm_password) {
        $errors[] = "Les mots de passe ne correspondent pas";
    }
    
    if (strlen($password) < 8) {
        $errors[] = "Le mot de passe doit contenir au moins 8 caractères";
    }
    
    if (empty($errors)) {
        // Vérifier si l'email existe déjà
        $stmt = $pdo->prepare("SELECT id FROM admins WHERE email = ?");
        $stmt->execute([$email]);
        if ($stmt->fetch()) {
            $errors[] = "Cet email est déjà utilisé";
        }
    }
    
    if (empty($errors)) {
        // Hasher le mot de passe
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);
        
        // Insérer l'admin
        $stmt = $pdo->prepare("INSERT INTO admins (email, password, full_name) VALUES (?, ?, ?)");
        $stmt->execute([$email, $hashed_password, $full_name]);
        
        $_SESSION['success'] = "Compte admin créé avec succès";
        header('Location: login.php');
        exit;
    }
}
?>
