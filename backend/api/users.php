<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../controllers/UserController.php';
use Controllers\UserController;

$userController = new UserController();

if($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['action']) && $_GET['action'] === 'stats') {
        $userController->getStats();
    } else {
        $userController->getAllUsers();
    }
} else if($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    $userController->createUser($data);
} else if($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $data = json_decode(file_get_contents("php://input"));
    if (isset($_GET['action']) && $_GET['action'] === 'self') {
        $userController->updateSelf($data);
    } else {
        $userController->updateUser($data);
    }
} else if($_SERVER['REQUEST_METHOD'] === 'DELETE' && isset($_GET['id'])) {
    $userController->deleteUser($_GET['id']);
} else {
    http_response_code(405);
    echo json_encode(array("message" => "Método não permitido."));
}
?>
