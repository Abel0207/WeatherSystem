<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config/Database.php';
require_once '../models/User.php';

use Config\Database;
use Models\User;

$database = new Database();
$db = $database->getConnection();
$user = new User($db);

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->token) && !empty($data->password)) {
    $password_hash = password_hash($data->password, PASSWORD_BCRYPT);
    if($user->resetPassword($data->token, $password_hash)) {
        http_response_code(200);
        echo json_encode(array("message" => "Senha atualizada com sucesso."));
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "Token inválido ou expirado."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Dados incompletos."));
}
?>
