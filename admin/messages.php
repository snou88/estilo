<?php
session_start();
require_once '../config/db_config.php';
require_once '../vendor/autoload.php';

// Vérification de l'authentification
if (!isset($_SESSION['admin_id'])) {
    header('Location: login.php');
    exit;
}

// Configuration PHPMailer
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Gestion des messages
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    switch ($_POST['action']) {
        case 'reply_message':
            $stmt = $pdo->prepare("SELECT * FROM contact_messages WHERE id = ?");
            $stmt->execute([$_POST['message_id']]);
            $message = $stmt->fetch();

            if ($message) {
                $mail = new PHPMailer(true);
                try {
                    $mail->isSMTP();
                    $mail->Host = 'smtp.gmail.com';
                    $mail->SMTPAuth = true;
                    $mail->Username = 'votre-email@gmail.com';
                    $mail->Password = 'votre-mot-de-passe-app';
                    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
                    $mail->Port = 587;

                    $mail->setFrom('votre-email@gmail.com', 'Estilo');
                    $mail->addAddress($message['email']);
                    $mail->isHTML(true);
                    $mail->Subject = 'Réponse à votre message - ' . $message['subject'];
                    $mail->Body = $_POST['reply_message'];

                    $mail->send();
                    
                    $stmt = $pdo->prepare("UPDATE contact_messages SET status = 'replied' WHERE id = ?");
                    $stmt->execute([$_POST['message_id']]);
                } catch (Exception $e) {
                    $_SESSION['error'] = "Erreur lors de l'envoi du message: " . $mail->ErrorInfo;
                }
            }
            break;

        case 'delete_message':
            $stmt = $pdo->prepare("DELETE FROM contact_messages WHERE id = ?");
            $stmt->execute([$_POST['message_id']]);
            break;
    }
}

// Récupération des messages
$messages = $pdo->query("SELECT * FROM contact_messages ORDER BY created_at DESC")->fetchAll();
?>
