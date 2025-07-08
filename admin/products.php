<?php
$pageTitle = 'Gestion des Produits';
require_once 'layout.php';
?>

<?php ob_start(); ?>
<div class="flex justify-between items-center mb-8">
    <h1 class="text-2xl font-bold">Gestion des Produits</h1>
    <div class="flex space-x-4">
        <button class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onclick="openProductForm()">
            Ajouter un produit
        </button>
        <button class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700" onclick="document.getElementById('addCategoryForm').style.display = 'block'">
            Ajouter une catégorie
        </button>
    </div>
</div>

<!-- Formulaire d'ajout de catégorie -->
<div id="addCategoryForm" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full hidden" style="display: none;">
    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <form method="POST" action="" class="space-y-4">
            <input type="hidden" name="action" value="add_category">
            <div>
                <label class="block text-sm font-medium text-gray-700">Nom de la catégorie</label>
                <input type="text" name="category_name" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
            </div>
            <div class="flex justify-end space-x-2">
                <button type="button" onclick="document.getElementById('addCategoryForm').style.display = 'none'" class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                    Annuler
                </button>
                <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Ajouter
                </button>
            </div>
        </form>
    </div>
</div>

<!-- Inclure le formulaire de produit -->
<?php include 'product-form.php'; ?>

<!-- Liste des produits -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <?php foreach ($products as $product): ?>
        <div class="bg-white rounded-lg shadow-md p-4">
            <h3 class="text-lg font-semibold mb-2"><?php echo htmlspecialchars($product['name']); ?></h3>
            <p class="text-gray-600 mb-2"><?php echo htmlspecialchars($product['description']); ?></p>
            <p class="text-blue-600 font-bold mb-2"><?php echo number_format($product['price'], 2); ?> DA</p>
            <p class="text-gray-500 mb-4"><?php echo htmlspecialchars($product['category_name']); ?></p>
            
            <!-- Afficher les images du produit -->
            <div class="grid grid-cols-2 gap-2 mb-4">
                <?php
                $stmt = $pdo->prepare("SELECT image_path FROM product_images WHERE product_id = ?");
                $stmt->execute([$product['id']]);
                $images = $stmt->fetchAll();
                
                foreach ($images as $image): ?>
                    <img src="../<?php echo htmlspecialchars($image['image_path']); ?>" 
                         alt="<?php echo htmlspecialchars($product['name']); ?>" 
                         class="w-full h-24 object-cover rounded">
                <?php endforeach; ?>
            </div>
            
            <div class="flex space-x-2">
                <button class="bg-yellow-400 text-white px-4 py-2 rounded hover:bg-yellow-500" onclick="editProduct(<?php echo $product['id']; ?>)">
                    Modifier
                </button>
                <button class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700" onclick="confirmDelete(<?php echo $product['id']; ?>)">
                    Supprimer
                </button>
            </div>
        </div>
    <?php endforeach; ?>
</div>

<script>
// Fonction pour ouvrir le formulaire de produit
function openProductForm(productId = 0) {
    // Charger les données du produit si c'est une modification
    if (productId > 0) {
        // Ici on pourrait faire une requête AJAX pour charger les données
    }
    document.getElementById('productFormModal').style.display = 'block';
}

// Fonction pour modifier un produit
function editProduct(productId) {
    openProductForm(productId);
}

// Fonction pour confirmer la suppression
function confirmDelete(productId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
        // Envoyer la requête de suppression
        const formData = new FormData();
        formData.append('product_id', productId);
        
        fetch('delete-product.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Mettre à jour l'interface
                location.reload();
            } else {
                alert('Erreur lors de la suppression');
            }
        })
        .catch(error => {
            console.error('Erreur:', error);
            alert('Une erreur est survenue');
        });
    }
}
</script>
<?php $content = ob_get_clean(); require_once 'layout.php'; ?>
