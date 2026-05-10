<?php
namespace Models;

use PDO;

class Favorite {
    private $conn;
    private $table_name = "favorites";

    public $id;
    public $user_id;
    public $city_name;
    public $country_code;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function add() {
        $query = "INSERT INTO " . $this->table_name . " SET user_id = :user_id, city_name = :city_name, country_code = :country_code";
        $stmt = $this->conn->prepare($query);

        $this->user_id = htmlspecialchars(strip_tags($this->user_id));
        $this->city_name = htmlspecialchars(strip_tags($this->city_name));
        $this->country_code = htmlspecialchars(strip_tags($this->country_code));

        $stmt->bindParam(':user_id', $this->user_id);
        $stmt->bindParam(':city_name', $this->city_name);
        $stmt->bindParam(':country_code', $this->country_code);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function getFavoritesByUser($user_id) {
        $query = "SELECT id, city_name, country_code, created_at FROM " . $this->table_name . " WHERE user_id = :user_id ORDER BY created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $user_id);
        $stmt->execute();
        return $stmt;
    }

    public function delete($id, $user_id) {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = :id AND user_id = :user_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':user_id', $user_id);
        
        if($stmt->execute()) {
            return true;
        }
        return false;
    }
    public function countAll() {
        $query = "SELECT COUNT(*) as total FROM " . $this->table_name;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row['total'];
    }
}
?>
