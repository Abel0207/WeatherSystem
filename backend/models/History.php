<?php
namespace Models;

use PDO;

class History {
    private $conn;
    private $table_name = "search_history";

    public $id;
    public $user_id;
    public $city_name;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function add() {
        $query = "INSERT INTO " . $this->table_name . " SET user_id = :user_id, city_name = :city_name";
        $stmt = $this->conn->prepare($query);

        $this->user_id = htmlspecialchars(strip_tags($this->user_id));
        $this->city_name = htmlspecialchars(strip_tags($this->city_name));

        $stmt->bindParam(':user_id', $this->user_id);
        $stmt->bindParam(':city_name', $this->city_name);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function getHistoryByUser($user_id) {
        $query = "SELECT id, city_name, search_timestamp FROM " . $this->table_name . " WHERE user_id = :user_id ORDER BY search_timestamp DESC LIMIT 50";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $user_id);
        $stmt->execute();
        return $stmt;
    }
    public function countAll() {
        $query = "SELECT COUNT(*) as total FROM " . $this->table_name;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row['total'];
    }

    public function getAllHistory() {
        $query = "SELECT h.id, h.city_name, h.search_timestamp, u.name as user_name 
                  FROM " . $this->table_name . " h
                  JOIN users u ON h.user_id = u.id
                  ORDER BY h.search_timestamp DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }
}
?>
