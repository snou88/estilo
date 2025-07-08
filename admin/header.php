<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Estilo Admin</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link href="css/logout-button.css" rel="stylesheet">
</head>
<body>
    <?php
    session_start();
    require_once '../config/db_config.php';
    ?>

    <header class="bg-blue-600 text-white p-4">
        <div class="container mx-auto flex justify-between items-center">
            <h1 class="text-2xl font-bold">Estilo Admin</h1>
            <div class="flex items-center space-x-4">
                <span class="text-white">Bienvenue, <?php echo htmlspecialchars($_SESSION['admin_name']); ?></span>
                <button class="admin-header-logout-btn" title="Déconnexion" data-logout-url="login.php?logout=1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-log-out">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" x2="9" y1="12" y2="12"></line>
                    </svg>
                </button>
            </div>
        </div>
    </header>

    <!-- Popup de confirmation -->
    <div id="logoutPopup" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full hidden" style="display: none;">
        <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 class="text-lg font-semibold mb-4 text-center">Êtes-vous sûr de vouloir vous déconnecter ?</h3>
            <div class="flex justify-end space-x-2">
                <button onclick="document.getElementById('logoutPopup').style.display = 'none'" class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                    Annuler
                </button>
                <button onclick="window.location.href=document.querySelector('.admin-header-logout-btn').getAttribute('data-logout-url')" class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                    Déconnexion
                </button>
            </div>
        </div>
    </div>

    <script>
    // Sélectionner le bouton de déconnexion
    const logoutBtn = document.querySelector('.admin-header-logout-btn');
    const logoutPopup = document.getElementById('logoutPopup');

    // Gestionnaire de clic pour le bouton de déconnexion
    logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        logoutPopup.style.display = 'block';
    });

    // Fermer le popup en cliquant en dehors
    document.addEventListener('click', function(e) {
        if (logoutPopup.style.display === 'block' && !logoutPopup.contains(e.target) && !logoutBtn.contains(e.target)) {
            logoutPopup.style.display = 'none';
        }
    });

    // Fermer le popup avec la touche Échap
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            logoutPopup.style.display = 'none';
        }
    });
    </script>

    <!-- Script pour le popup de déconnexion -->
    <script src="js/logout-button.js"></script>
</body>
</html>
