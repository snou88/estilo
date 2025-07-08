// Fonctions pour gérer le popup de confirmation
document.addEventListener('DOMContentLoaded', function() {
    const confirmLogoutPopup = document.getElementById('confirmLogout');
    
    // Fonction pour afficher le popup
    function showConfirmLogout() {
        confirmLogoutPopup.classList.add('show');
    }

    // Fonction pour cacher le popup
    function hideConfirmLogout() {
        confirmLogoutPopup.classList.remove('show');
    }

    // Gestionnaire de clic pour les boutons de déconnexion
    document.querySelectorAll('a[href*="logout=1"]').forEach(function(button) {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            showConfirmLogout();
        });
    });

    // Gestionnaire de clic pour les formulaires de déconnexion
    document.querySelectorAll('form[action*="logout=1"]').forEach(function(form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            showConfirmLogout();
        });
    });

    // Gestionnaire pour le bouton Annuler
    document.querySelector('.btn-cancel').addEventListener('click', function() {
        hideConfirmLogout();
    });

    // Gestionnaire pour le bouton Déconnexion
    document.querySelector('.btn-confirm').addEventListener('click', function() {
        // Récupérer le lien de déconnexion
        const logoutLink = document.querySelector('.btn-logout').href;
        window.location.href = logoutLink;
    });

    // Fermer le popup en cliquant en dehors
    confirmLogoutPopup.addEventListener('click', function(e) {
        if (e.target === confirmLogoutPopup) {
            hideConfirmLogout();
        }
    });
});
