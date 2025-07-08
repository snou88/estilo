<?php
require_once 'security.php';
require_once 'config.php';

// Vérifier la session
if (!isset($_SESSION['admin_id'])) {
    header('Location: login.php');
    exit;
}

// Vérifier le timeout
if (isset($_SESSION['last_activity']) && (time() - $_SESSION['last_activity'] > $admin_config['session_timeout'])) {
    session_destroy();
    header('Location: login.php');
    exit;
}

// Mettre à jour l'activité
$_SESSION['last_activity'] = time();
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard Admin - Estilo</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link href="css/admin.css" rel="stylesheet">
</head>
<body class="bg-gray-100">
    <nav class="bg-blue-600 text-white p-4">
        <div class="container mx-auto flex justify-between items-center">
            <h1 class="text-2xl font-bold">Estilo Admin</h1>
            <div class="flex items-center space-x-4">
                <span>Bienvenue, <?php echo htmlspecialchars($_SESSION['admin_name']); ?></span>
                <a href="login.php?logout=1" class="bg-red-600 px-4 py-2 rounded hover:bg-red-700 btn-logout">Déconnexion</a>
            </div>
        </div>
    </nav>

    <div class="container mx-auto p-8">
        <h2 class="text-2xl font-bold mb-8">Tableau de bord</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-white p-6 rounded-lg shadow">
                <h3 class="text-xl font-semibold mb-2">Produits</h3>
                <p class="text-3xl font-bold"><?php echo $pdo->query("SELECT COUNT(*) FROM products")->fetchColumn(); ?></p>
                <a href="products.php" class="block mt-4 text-blue-600 hover:text-blue-800">Voir tous les produits</a>
            </div>
            <div class="bg-white p-6 rounded-lg shadow">
                <h3 class="text-xl font-semibold mb-2">Commandes</h3>
                <p class="text-3xl font-bold"><?php echo $pdo->query("SELECT COUNT(*) FROM orders")->fetchColumn(); ?></p>
                <a href="orders.php" class="block mt-4 text-blue-600 hover:text-blue-800">Voir toutes les commandes</a>
            </div>
            <div class="bg-white p-6 rounded-lg shadow">
                <h3 class="text-xl font-semibold mb-2">Messages</h3>
                <p class="text-3xl font-bold"><?php 
                    $stmt = $pdo->prepare("SELECT COUNT(*) FROM contact_messages WHERE status = 'unread'");
                    $stmt->execute();
                    echo $stmt->fetchColumn();
                ?></p>
                <a href="messages.php" class="block mt-4 text-blue-600 hover:text-blue-800">Voir tous les messages</a>
            </div>
        </div>
    </div>
    <!-- Popup de confirmation -->
    <div class="confirm-logout" id="confirmLogout">
        <p>Êtes-vous sûr de vouloir vous déconnecter ?</p>
        <div class="buttons">
            <button class="btn-cancel" onclick="cancelLogout()">Annuler</button>
            <button class="btn-confirm" onclick="confirmLogout()">Déconnexion</button>
        </div>
    </div>

    <script src="js/admin.js"></script>
</body>
</html>
