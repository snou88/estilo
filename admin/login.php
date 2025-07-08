<?php
require_once 'session_manager.php';

// Configuration des headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Expose-Headers: Content-Type, Authorization');

// Gérer la requête OPTIONS (prévolée)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Max-Age: 3600');
    exit(0);
}

// Configuration de la base de données
require_once '../config/db_config.php';

// Fonction de réponse JSON
function jsonResponse($data) {
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

// Vérifier si l'utilisateur est déjà connecté
if (isset($_SESSION['admin_id'])) {
    header('Location: dashboard.php');
    exit;
}

// Gérer la soumission du formulaire
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Sanitization des données
    $email = filter_var($_POST['email'] ?? '', FILTER_SANITIZE_EMAIL);
    $password = $_POST['password'] ?? '';
    $redirect = filter_var($_POST['redirect'] ?? 'dashboard.php', FILTER_SANITIZE_URL);
    
    // Validation des données
    if (empty($email) || empty($password)) {
        $error = 'Veuillez remplir tous les champs';
    } else {
        try {
            // Préparation et exécution de la requête
            $stmt = $pdo->prepare("SELECT id, email, full_name, password FROM admins WHERE email = ?");
            $stmt->execute([$email]);
            $admin = $stmt->fetch();
            
            if ($admin && password_verify($password, $admin['password'])) {
                // Connexion réussie
                $_SESSION['admin_id'] = $admin['id'];
                $_SESSION['admin_name'] = $admin['full_name'];
                $_SESSION['admin_email'] = $admin['email'];
                
                // Redirection vers la page demandée
                header('Location: ' . $redirect);
                exit;
            } else {
                $error = 'Email ou mot de passe incorrect';
            }
        } catch (PDOException $e) {
            // Log de l'erreur
            error_log("Erreur de connexion: " . $e->getMessage());
            $error = 'Une erreur est survenue';
        }
    }
}
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Connexion - Estilo Admin</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <style>
        body {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        .login-container {
            background: white;
            padding: 2rem;
            border-radius: 1rem;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
    </style>
</head>
<body class="flex items-center justify-center">
    <div class="login-container w-full max-w-md mx-auto">
        <h1 class="text-3xl font-bold text-center mb-8">Connexion Admin</h1>
        
        <?php if (isset($error)): ?>
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                <?php echo htmlspecialchars($error); ?>
            </div>
        <?php endif; ?>

        <form method="POST" class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" name="email" required 
                       class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                       value="<?php echo htmlspecialchars($_POST['email'] ?? ''); ?>">
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700">Mot de passe</label>
                <input type="password" name="password" required 
                       class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
            </div>

            <input type="hidden" name="redirect" value="<?php echo htmlspecialchars($_GET['redirect'] ?? 'dashboard.php'); ?>">

            <button type="submit" class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                Se connecter
            </button>
        </form>

        <p class="text-center mt-4">
            Pas encore de compte ?
            <a href="register.php" class="text-blue-600 hover:text-blue-800">S'inscrire</a>
        </p>
    </div>
</body>
</html>
