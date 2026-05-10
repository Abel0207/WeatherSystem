<?php
namespace Models;

use PDO;

class User {
    private $conn;
    private $table_name = "users";

    public $id;
    public $name;
    public $email;
    public $password_hash;
    public $role;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function emailExists() {
        $query = "SELECT id, name, password_hash, role FROM " . $this->table_name . " WHERE email = ? LIMIT 0,1";
        $stmt = $this->conn->prepare($query);
        $this->email = htmlspecialchars(strip_tags($this->email));
        $stmt->bindParam(1, $this->email);
        $stmt->execute();

        if($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $this->id = $row['id'];
            $this->name = $row['name'];
            $this->password_hash = $row['password_hash'];
            $this->role = $row['role'];
            return true;
        }
        return false;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . " SET name = :name, email = :email, password_hash = :password_hash, role = :role";
        $stmt = $this->conn->prepare($query);

        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->email = htmlspecialchars(strip_tags($this->email));
        $this->password_hash = htmlspecialchars(strip_tags($this->password_hash));
        $this->role = $this->role ? htmlspecialchars(strip_tags($this->role)) : 'user';

        $stmt->bindParam(':name', $this->name);
        $stmt->bindParam(':email', $this->email);
        $stmt->bindParam(':password_hash', $this->password_hash);
        $stmt->bindParam(':role', $this->role);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function getAllUsers() {
        $query = "SELECT id, name, email, role, created_at FROM " . $this->table_name . " ORDER BY id DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function getById($id) {
        $query = "SELECT id, name, email, role FROM " . $this->table_name . " WHERE id = ? LIMIT 0,1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $id);
        $stmt->execute();

        if($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $this->id = $row['id'];
            $this->name = $row['name'];
            $this->email = $row['email'];
            $this->role = $row['role'];
            return true;
        }
        return false;
    }

    public function update() {
        $password_set = !empty($this->password_hash);
        $query = "UPDATE " . $this->table_name . " SET name = :name, email = :email, role = :role" . 
                 ($password_set ? ", password_hash = :password_hash" : "") . 
                 " WHERE id = :id";
        
        $stmt = $this->conn->prepare($query);

        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->email = htmlspecialchars(strip_tags($this->email));
        $this->role = htmlspecialchars(strip_tags($this->role));
        $this->id = htmlspecialchars(strip_tags($this->id));

        $stmt->bindParam(':name', $this->name);
        $stmt->bindParam(':email', $this->email);
        $stmt->bindParam(':role', $this->role);
        $stmt->bindParam(':id', $this->id);

        if($password_set) {
            $stmt->bindParam(':password_hash', $this->password_hash);
        }

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

    public function updateResetToken($email, $token) {
        $query = "UPDATE " . $this->table_name . " 
                  SET reset_token = :token, token_expires = DATE_ADD(NOW(), INTERVAL 1 HOUR) 
                  WHERE email = :email";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':token', $token);
        $stmt->bindParam(':email', $email);
        return $stmt->execute();
    }

    public function resetPassword($token, $new_password_hash) {
        $query = "UPDATE " . $this->table_name . " 
                  SET password_hash = :password, reset_token = NULL, token_expires = NULL 
                  WHERE reset_token = :token AND token_expires > NOW()";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':password', $new_password_hash);
        $stmt->bindParam(':token', $token);
        return $stmt->execute();
    }
}
?>
