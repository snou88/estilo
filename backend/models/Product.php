<?php
class Product {
    private $conn;
    private $table_name = "products";

    public $id;
    public $name;
    public $description;
    public $price;
    public $category_id;
    public $image_url;
    public $sizes;
    public $colors;
    public $stock_quantity;
    public $is_active;
    public $created_at;
    public $updated_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Lire tous les produits
    public function read() {
        $query = "SELECT 
                    p.id, p.name, p.description, p.price, 
                    p.image_url, p.sizes, p.colors, p.stock_quantity,
                    c.name as category_name
                  FROM " . $this->table_name . " p
                  LEFT JOIN categories c ON p.category_id = c.id
                  WHERE p.is_active = 1
                  ORDER BY p.created_at DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt;
    }

    // Lire un produit par ID
    public function readOne() {
        $query = "SELECT 
                    p.id, p.name, p.description, p.price, 
                    p.image_url, p.sizes, p.colors, p.stock_quantity,
                    c.name as category_name
                  FROM " . $this->table_name . " p
                  LEFT JOIN categories c ON p.category_id = c.id
                  WHERE p.id = ? AND p.is_active = 1
                  LIMIT 0,1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if($row) {
            $this->name = $row['name'];
            $this->description = $row['description'];
            $this->price = $row['price'];
            $this->image_url = $row['image_url'];
            $this->sizes = $row['sizes'];
            $this->colors = $row['colors'];
            $this->stock_quantity = $row['stock_quantity'];
        }
    }

    // Créer un produit
    public function create() {
        $query = "INSERT INTO " . $this->table_name . "
                  SET name=:name, description=:description, price=:price,
                      category_id=:category_id, image_url=:image_url,
                      sizes=:sizes, colors=:colors, stock_quantity=:stock_quantity";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":description", $this->description);
        $stmt->bindParam(":price", $this->price);
        $stmt->bindParam(":category_id", $this->category_id);
        $stmt->bindParam(":image_url", $this->image_url);
        $stmt->bindParam(":sizes", $this->sizes);
        $stmt->bindParam(":colors", $this->colors);
        $stmt->bindParam(":stock_quantity", $this->stock_quantity);

        if($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Mettre à jour un produit
    public function update() {
        $query = "UPDATE " . $this->table_name . "
                  SET name=:name, description=:description, price=:price,
                      category_id=:category_id, image_url=:image_url,
                      sizes=:sizes, colors=:colors, stock_quantity=:stock_quantity
                  WHERE id=:id";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":description", $this->description);
        $stmt->bindParam(":price", $this->price);
        $stmt->bindParam(":category_id", $this->category_id);
        $stmt->bindParam(":image_url", $this->image_url);
        $stmt->bindParam(":sizes", $this->sizes);
        $stmt->bindParam(":colors", $this->colors);
        $stmt->bindParam(":stock_quantity", $this->stock_quantity);
        $stmt->bindParam(":id", $this->id);

        if($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Supprimer un produit (soft delete)
    public function delete() {
        $query = "UPDATE " . $this->table_name . " SET is_active = 0 WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);

        if($stmt->execute()) {
            return true;
        }

        return false;
    }
}
?>