<?php
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once '../../config/db_config.php';

try {
    // Get query parameters for filtering
    $category_id = isset($_GET['category_id']) ? (int)$_GET['category_id'] : null;
    $min_price = isset($_GET['min_price']) ? (float)$_GET['min_price'] : null;
    $max_price = isset($_GET['max_price']) ? (float)$_GET['max_price'] : null;
    $search = isset($_GET['search']) ? '%' . $_GET['search'] . '%' : null;
    $color = isset($_GET['color']) ? $_GET['color'] : null;

    // Base query to get products with their main image
    $sql = "SELECT p.id, p.name, p.description, p.price, p.category_id, c.name as category_name,
                   (
                       SELECT image_path FROM product_images
                       WHERE product_id = p.id
                       ORDER BY is_main DESC, id ASC
                       LIMIT 1
                   ) AS image_url
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE 1=1";

    $params = [];

    // Add filters
    if ($category_id) {
        $sql .= " AND p.category_id = :category_id";
        $params[':category_id'] = $category_id;
    }
    
    if ($min_price !== null) {
        $sql .= " AND p.price >= :min_price";
        $params[':min_price'] = $min_price;
    }
    
    if ($max_price !== null) {
        $sql .= " AND p.price <= :max_price";
        $params[':max_price'] = $max_price;
    }
    
    if ($search) {
        $sql .= " AND (p.name LIKE :search OR p.description LIKE :search)";
        $params[':search'] = $search;
    }
    
    // If color filter is applied, we'll need to join with product_images
    if ($color) {
        $sql .= " AND p.id IN (
                    SELECT DISTINCT product_id 
                    FROM product_images 
                    WHERE color = :color
                  )";
        $params[':color'] = $color;
    }

    // Prepare and execute the query
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Get all colors for each product
    $productIds = array_column($products, 'id');
    $colorsByProduct = [];
    
    if (!empty($productIds)) {
        $placeholders = rtrim(str_repeat('?,', count($productIds)), ',');
        $colorStmt = $pdo->prepare("
            SELECT DISTINCT product_id, color 
            FROM product_images 
            WHERE product_id IN ($placeholders) AND color IS NOT NULL
        ");
        $colorStmt->execute($productIds);
        
        while ($row = $colorStmt->fetch(PDO::FETCH_ASSOC)) {
            if (!isset($colorsByProduct[$row['product_id']])) {
                $colorsByProduct[$row['product_id']] = [];
            }
            if (!in_array($row['color'], $colorsByProduct[$row['product_id']])) {
                $colorsByProduct[$row['product_id']][] = $row['color'];
            }
        }
    }

    // Add colors to each product
    foreach ($products as &$product) {
        $product['colors'] = $colorsByProduct[$product['id']] ?? [];
    }
    unset($product); // Break the reference

    // Get all available colors for filters
    $colorStmt = $pdo->query("SELECT DISTINCT color FROM product_images WHERE color IS NOT NULL ORDER BY color");
    $availableColors = $colorStmt->fetchAll(PDO::FETCH_COLUMN);

    // Get min and max prices for filters
    $priceStmt = $pdo->query("SELECT MIN(price) as min_price, MAX(price) as max_price FROM products");
    $priceRange = $priceStmt->fetch(PDO::FETCH_ASSOC);

    http_response_code(200);
    echo json_encode([
        "products" => $products,
        "filters" => [
            "colors" => $availableColors,
            "price_range" => [
                "min" => (float)$priceRange['min_price'],
                "max" => (float)$priceRange['max_price']
            ]
        ]
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Erreur serveur: " . $e->getMessage()]);
}
?>