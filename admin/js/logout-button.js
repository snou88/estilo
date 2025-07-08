document.addEventListener('DOMContentLoaded', function() {
    // Sélectionner le bouton de déconnexion
    const logoutBtn = document.querySelector('.admin-header-logout-btn');
    const logoutPopup = document.createElement('div');
    
    // Créer le contenu du popup
    logoutPopup.className = 'logout-popup';
    logoutPopup.innerHTML = `
        <h3>Êtes-vous sûr de vouloir vous déconnecter ?</h3>
        <div class="buttons">
            <button class="btn-cancel">Annuler</button>
            <button class="btn-confirm">Déconnexion</button>
        </div>
    `;
    
    // Ajouter le popup au DOM
    document.body.appendChild(logoutPopup);
    
    // Gestionnaire de clic pour le bouton de déconnexion
    logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        logoutPopup.classList.add('show');
    });
    
    // Gestionnaire pour le bouton Annuler
    logoutPopup.querySelector('.btn-cancel').addEventListener('click', function() {
        logoutPopup.classList.remove('show');
    });
    
    // Gestionnaire pour le bouton Déconnexion
    logoutPopup.querySelector('.btn-confirm').addEventListener('click', function() {
        // Récupérer l'URL de déconnexion depuis le bouton
        const logoutUrl = logoutBtn.getAttribute('data-logout-url') || 'login.php?logout=1';
        window.location.href = logoutUrl;
    });
    
    // Fermer le popup en cliquant en dehors
    logoutPopup.addEventListener('click', function(e) {
        if (e.target === logoutPopup) {
            logoutPopup.classList.remove('show');
        }
    });
    
    // Fermer le popup avec la touche Échap
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            logoutPopup.classList.remove('show');
        }
    });
});
