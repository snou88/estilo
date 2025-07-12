<?php
// Configuration de sécurité
$admin_config = [
    'session_timeout' => 1800, // 30 minutes
    'max_login_attempts' => 3,
    'lockout_duration' => 300, // 5 minutes
    'password_min_length' => 8,
    'password_max_length' => 255,
    // Configuration pour le développement local
    'allowed_ip_ranges' => [
        '127.0.0.1',    // localhost IPv4
        '::1'          // localhost IPv6
    ],
    'allowed_user_agents' => [
        'Mozilla/5.0'  // Permettre tous les navigateurs modernes
    ]
];

// Fonction pour vérifier l'IP
function checkIP($ip) {
    global $admin_config;
    return in_array($ip, $admin_config['allowed_ip_ranges']);
}

// Fonction pour vérifier l'User-Agent
function checkUserAgent($user_agent) {
    global $admin_config;
    foreach ($admin_config['allowed_user_agents'] as $pattern) {
        if (stripos($user_agent, $pattern) !== false) {
            return true;
        }
    }
    return false;
}

// Vérifier l'IP et l'User-Agent uniquement en production
if (!in_array($_SERVER['REMOTE_ADDR'], ['127.0.0.1', '::1'])) {
    if (!checkIP($_SERVER['REMOTE_ADDR']) || !checkUserAgent($_SERVER['HTTP_USER_AGENT'])) {
        header('HTTP/1.0 403 Forbidden');
        die('Accès non autorisé');
    }
}
?>
