<?php
require_once 'check_session.php';
require_once '../config/db_config.php';

// Récupérer l'ID du produit si c'est une modification
$product_id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

// Si c'est une modification, récupérer les données du produit
$product = null;
if ($product_id > 0) {
    $stmt = $pdo->prepare("SELECT * FROM products WHERE id = ?");
    $stmt->execute([$product_id]);
    $product = $stmt->fetch();
}

// Récupérer toutes les catégories
$categories = $pdo->query("SELECT * FROM categories ORDER BY name")->fetchAll();
?>

<div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full hidden" id="productFormModal" style="display: none;">
    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <form method="POST" action="save-product.php" enctype="multipart/form-data" class="space-y-4">
            <input type="hidden" name="product_id" value="<?php echo $product_id; ?>">
            
            <div>
                <label class="block text-sm font-medium text-gray-700">Nom du produit</label>
                <input type="text" name="name" required 
                       value="<?php echo $product ? htmlspecialchars($product['name']) : ''; ?>"
                       class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700">Description</label>
                <textarea name="description" required 
                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                    <?php echo $product ? htmlspecialchars($product['description']) : ''; ?>
                </textarea>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700">Prix (DA)</label>
                <input type="number" name="price" required step="0.01" 
                       value="<?php echo $product ? number_format($product['price'], 2) : ''; ?>"
                       class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700">Catégorie</label>
                <select name="category_id" required 
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                    <?php foreach ($categories as $category): ?>
                        <option value="<?php echo $category['id']; ?>"
                                <?php echo $product && $product['category_id'] == $category['id'] ? 'selected' : ''; ?>>
                            <?php echo htmlspecialchars($category['name']); ?>
                        </option>
                    <?php endforeach; ?>
                </select>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700">Images</label>
                <input type="file" name="images[]" multiple accept="image/*" 
                       class="mt-1 block w-full">
            </div>

            <?php if ($product): ?>
                <div class="flex justify-end space-x-2">
                    <button type="button" onclick="closeProductForm()" class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                        Annuler
                    </button>
                    <button type="submit" name="action" value="update" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Modifier
                    </button>
                </div>
            <?php else: ?>
                <div class="flex justify-end space-x-2">
                    <button type="button" onclick="closeProductForm()" class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                        Annuler
                    </button>
                    <button type="submit" name="action" value="create" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Créer
                    </button>
                </div>
            <?php endif; ?>
        </form>
    </div>
</div>

<script>
function openProductForm(productId = 0) {
    document.getElementById('productFormModal').style.display = 'block';
    // Si c'est une modification, charger les données du produit
    if (productId > 0) {
        // Ici on pourrait faire une requête AJAX pour charger les données
    }
}

function closeProductForm() {
    document.getElementById('productFormModal').style.display = 'none';
}

// Fermer le modal en cliquant en dehors
document.addEventListener('click', function(e) {
    const modal = document.getElementById('productFormModal');
    if (modal.style.display === 'block' && !modal.contains(e.target)) {
        closeProductForm();
    }
});

// Fermer avec la touche Échap
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeProductForm();
    }
});
</script>
