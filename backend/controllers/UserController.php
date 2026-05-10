<?php
namespace Controllers;

require_once '../config/Database.php';
require_once '../models/User.php';
require_once '../models/History.php';
require_once '../models/Favorite.php';
require_once '../utils/JwtHandler.php';

use Config\Database;
use Models\User;
use Models\History;
use Models\Favorite;
use Utils\JwtHandler;
use PDO;

class UserController {
    private $db;
    private $user;
    private $history;
    private $favorite;
    private $jwt;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->user = new User($this->db);
        $this->history = new History($this->db);
        $this->favorite = new Favorite($this->db);
        $this->jwt = new JwtHandler();
    }

    private function authenticateAdmin() {
        $authData = $this->jwt->getAuthData();
        if(!$authData || $authData->data->role !== 'admin') {
            http_response_code(403);
            echo json_encode(array("message" => "Acesso negado. Requer privilégios de administrador."));
            exit();
        }
        return $authData->data;
    }

    public function getAllUsers() {
        $this->authenticateAdmin();
        $stmt = $this->user->getAllUsers();
        $users = array();
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            array_push($users, $row);
        }
        http_response_code(200);
        echo json_encode($users);
    }
    
    public function deleteUser($id) {
        $this->authenticateAdmin();
        $query = "DELETE FROM users WHERE id = :id";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':id', $id);
        if($stmt->execute()) {
            http_response_code(200);
            echo json_encode(array("message" => "Utilizador removido."));
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "Erro ao remover utilizador."));
        }
    }

    public function createUser($data) {
        $this->authenticateAdmin();
        if(!empty($data->name) && !empty($data->email) && !empty($data->password)) {
            $this->user->name = $data->name;
            $this->user->email = $data->email;
            $this->user->password_hash = password_hash($data->password, PASSWORD_DEFAULT);
            $this->user->role = $data->role ?? 'user';

            if($this->user->create()) {
                http_response_code(201);
                echo json_encode(array("message" => "Utilizador criado."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Erro ao criar utilizador."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Dados incompletos."));
        }
    }

    public function updateUser($data) {
        $this->authenticateAdmin();
        if(!empty($data->id) && !empty($data->name) && !empty($data->email)) {
            $this->user->id = $data->id;
            $this->user->name = $data->name;
            $this->user->email = $data->email;
            $this->user->role = $data->role ?? 'user';
            
            if(!empty($data->password)) {
                $this->user->password_hash = password_hash($data->password, PASSWORD_DEFAULT);
            } else {
                $this->user->password_hash = "";
            }

            if($this->user->update()) {
                http_response_code(200);
                echo json_encode(array("message" => "Utilizador atualizado."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Erro ao atualizar utilizador."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Dados incompletos."));
        }
    }

    public function updateSelf($data) {
        $authData = $this->jwt->getAuthData();
        if(!$authData) {
            http_response_code(401);
            echo json_encode(array("message" => "Não autorizado."));
            exit();
        }
        
        if(!empty($data->name) && !empty($data->email)) {
            $this->user->id = $authData->data->id;
            $this->user->name = $data->name;
            $this->user->email = $data->email;
            $this->user->role = $authData->data->role; // Don't let user change their own role

            if(!empty($data->password)) {
                $this->user->password_hash = password_hash($data->password, PASSWORD_DEFAULT);
            } else {
                $this->user->password_hash = "";
            }

            if($this->user->update()) {
                http_response_code(200);
                echo json_encode(array("message" => "Perfil atualizado com sucesso."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Erro ao atualizar perfil."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Dados incompletos."));
        }
    }

    public function getStats() {
        $this->authenticateAdmin();
        $stats = [
            'total_users' => $this->user->countAll(),
            'total_searches' => $this->history->countAll(),
            'total_favorites' => $this->favorite->countAll()
        ];
        http_response_code(200);
        echo json_encode($stats);
    }
}
?>
