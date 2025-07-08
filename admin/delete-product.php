<?php
require_once 'check_session.php';
require_once '../config/db_config.php';

$product_id = $_POST['product_id'] ?? 0;

if ($product_id > 0) {
    try {
        // Démarrer une transaction
        $pdo->beginTransaction();
        
        // Supprimer les images du produit
        $stmt = $pdo->prepare("SELECT image_path FROM product_images WHERE product_id = ?");
        $stmt->execute([$product_id]);
        
        while ($image = $stmt->fetch()) {
            $image_path = "../" . $image['image_path'];
            if (file_exists($image_path)) {
                unlink($image_path);
            }
        }
        
        // Supprimer les entrées dans la table product_images
        $stmt = $pdo->prepare("DELETE FROM product_images WHERE product_id = ?");
        $stmt->execute([$product_id]);
        
        // Supprimer le produit
        $stmt = $pdo->prepare("DELETE FROM products WHERE id = ?");
        $stmt->execute([$product_id]);
        
        // Valider la transaction
        $pdo->commit();
        
        $_SESSION['success'] = "Le produit a été supprimé avec succès";
    } catch (Exception $e) {
        // Annuler la transaction en cas d'erreur
        $pdo->rollBack();
        $_SESSION['error'] = "Une erreur est survenue lors de la suppression du produit";
    }
} else {
    $_SESSION['error'] = "ID de produit invalide";
}

header('Location: products.php');
exit;
