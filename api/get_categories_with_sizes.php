<?php
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once '../config/db_config.php';

try {
    $stmt = $pdo->query("
        SELECT 
            c.id AS category_id, c.name AS category_name, s.id AS size_id, s.name AS size_name
        FROM categories c
        LEFT JOIN category_sizes cs ON cs.category_id = c.id
        LEFT JOIN sizes s ON s.id = cs.size_id
        ORDER BY c.id, s.id
    ");

    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $categories = [];

    foreach ($results as $row) {
        $catId = $row['category_id'];

        if (!isset($categories[$catId])) {
            $categories[$catId] = [
                'id' => $catId,
                'name' => $row['category_name'],
                'sizes' => []
            ];
        }

        if ($row['size_id']) {
            $categories[$catId]['sizes'][] = [
                'id' => $row['size_id'],
                'name' => $row['size_name']
            ];
        }
    }

    echo json_encode(array_values($categories));

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>