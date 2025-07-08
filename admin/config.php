<?php
// Configuration de sécurité
$admin_config = [
    'session_timeout' => 1800, // 30 minutes
    'max_login_attempts' => 3,
    'lockout_duration' => 300, // 5 minutes
    'password_min_length' => 8,
    'password_max_length' => 255,
    'allowed_ip_ranges' => [
        // Permettre toutes les IP pour l'instant
        '0.0.0.0/0'
    ],
    'allowed_user_agents' => [
        // Permettre tous les navigateurs pour l'instant
        '.*'
    ]
];

// Fonction pour vérifier l'IP
function checkIP($ip) {
    global $admin_config;
    foreach ($admin_config['allowed_ip_ranges'] as $range) {
        if (preg_match('/^' . str_replace('/', '\/', $range) . '$/', $ip)) {
            return true;
        }
    }
    return false;
}

// Fonction pour vérifier l'User-Agent
function checkUserAgent($user_agent) {
    global $admin_config;
    foreach ($admin_config['allowed_user_agents'] as $pattern) {
        if (preg_match('/' . $pattern . '/', $user_agent)) {
            return true;
        }
    }
    return false;
}

// Vérifier l'IP et l'User-Agent
if (!checkIP($_SERVER['REMOTE_ADDR']) || !checkUserAgent($_SERVER['HTTP_USER_AGENT'])) {
    header('HTTP/1.0 403 Forbidden');
    die('Accès non autorisé');
}
?>
