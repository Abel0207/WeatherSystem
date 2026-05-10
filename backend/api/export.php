<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config/Database.php';
require_once '../models/History.php';
require_once '../utils/JwtHandler.php';

use Utils\JwtHandler;
use Config\Database;
use Models\History;
use PDO;

$jwt = new JwtHandler();
$authData = $jwt->getAuthData();
if(!$authData || $authData->data->role !== 'admin') {
    header("Content-Type: application/json; charset=UTF-8");
    http_response_code(403);
    echo json_encode(array("message" => "Acesso negado. Apenas administradores podem exportar o histórico."));
    exit();
}

$database = new Database();
$db = $database->getConnection();
$history = new History($db);
$stmt = $history->getAllHistory();

// Set Excel Headers
header("Content-Type: application/vnd.ms-excel; charset=UTF-8");
header("Content-Disposition: attachment; filename=Relatorio_WeatherSystem_" . date('Ymd_His') . ".xls");
header("Pragma: no-cache");
header("Expires: 0");

// Output HTML Table for Excel
echo "
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:excel' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<meta http-equiv='Content-Type' content='text/html; charset=utf-8'>
<style>
    .header { background-color: #D97706; color: white; font-weight: bold; }
    .title { font-size: 20px; font-weight: bold; color: #1f2937; }
    .meta { color: #6b7280; font-size: 12px; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #e5e7eb; padding: 10px; text-align: left; font-family: 'Inter', sans-serif; }
    tr:nth-child(even) { background-color: #f9fafb; }
</style>
</head>
<body>
    <div class='title'>WeatherSystem - Relatório de Histórico</div>
    <div class='meta'>Gerado por: " . $authData->data->name . " em " . date('d/m/Y H:i:s') . "</div>
    <br>
    <table>
        <thead>
            <tr class='header'>
                <th style='width: 50px;'>ID</th>
                <th style='width: 200px;'>Cidade</th>
                <th style='width: 200px;'>Utilizador</th>
                <th style='width: 200px;'>Data e Hora</th>
            </tr>
        </thead>
        <tbody>";

while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    echo "
            <tr>
                <td>" . $row['id'] . "</td>
                <td>" . $row['city_name'] . "</td>
                <td>" . $row['user_name'] . "</td>
                <td>" . date('d/m/Y H:i:s', strtotime($row['search_timestamp'])) . "</td>
            </tr>";
}

echo "
        </tbody>
    </table>
</body>
</html>";
?>
