<?php
namespace Controllers;

require_once '../config/Database.php';
require_once '../models/User.php';
require_once '../utils/JwtHandler.php';

use Config\Database;
use Models\User;
use Utils\JwtHandler;

class AuthController {
    private $db;
    private $user;
    private $jwt;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->user = new User($this->db);
        $this->jwt = new JwtHandler();
    }

    public function register($data) {
        if(!empty($data->name) && !empty($data->email) && !empty($data->password)) {
            $this->user->name = $data->name;
            $this->user->email = $data->email;
            $this->user->password_hash = password_hash($data->password, PASSWORD_BCRYPT);
            $this->user->role = isset($data->role) ? $data->role : 'user';

            if($this->user->emailExists()) {
                http_response_code(400);
                echo json_encode(array("message" => "Email já registado."));
                return;
            }

            if($this->user->create()) {
                http_response_code(201);
                echo json_encode(array("message" => "Utilizador registado com sucesso."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Incapaz de registar o utilizador."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Dados incompletos."));
        }
    }

    public function login($data) {
        if(!empty($data->email) && !empty($data->password)) {
            $this->user->email = $data->email;
            if($this->user->emailExists() && password_verify($data->password, $this->user->password_hash)) {
                $token_data = array(
                    "id" => $this->user->id,
                    "name" => $this->user->name,
                    "email" => $this->user->email,
                    "role" => $this->user->role
                );
                
                $jwt = $this->jwt->generateToken($token_data);

                http_response_code(200);
                echo json_encode(array(
                    "message" => "Login efetuado com sucesso.",
                    "token" => $jwt,
                    "user" => $token_data
                ));
            } else {
                http_response_code(401);
                echo json_encode(array("message" => "Login falhou. Email ou password incorretos."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Dados incompletos."));
        }
    }
}
?>
