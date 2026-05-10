<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../controllers/WeatherController.php';
use Controllers\WeatherController;

$weather = new WeatherController();
$action = isset($_GET['action']) ? $_GET['action'] : '';

switch($action) {
    case 'current':
        if($_SERVER['REQUEST_METHOD'] === 'GET') {
            $lang = isset($_GET['lang']) ? $_GET['lang'] : 'pt';
            if (isset($_GET['lat']) && isset($_GET['lon'])) {
                $weather->getWeatherByCoords($_GET['lat'], $_GET['lon'], $lang);
            } else if (isset($_GET['city'])) {
                $weather->getWeather($_GET['city'], $lang);
            }
        }
        break;
    case 'forecast':
        if($_SERVER['REQUEST_METHOD'] === 'GET') {
            $lang = isset($_GET['lang']) ? $_GET['lang'] : 'pt';
            if (isset($_GET['lat']) && isset($_GET['lon'])) {
                $weather->getForecastByCoords($_GET['lat'], $_GET['lon'], $lang);
            } else if (isset($_GET['city'])) {
                $weather->getForecast($_GET['city'], $lang);
            }
        }
        break;
    case 'favorites':
        if($_SERVER['REQUEST_METHOD'] === 'GET') {
            $weather->getFavorites();
        } else if($_SERVER['REQUEST_METHOD'] === 'POST') {
            $data = json_decode(file_get_contents("php://input"));
            $weather->addFavorite($data);
        } else if($_SERVER['REQUEST_METHOD'] === 'DELETE' && isset($_GET['id'])) {
            $weather->removeFavorite($_GET['id']);
        }
        break;
    case 'history':
        if($_SERVER['REQUEST_METHOD'] === 'GET') {
            $weather->getHistory();
        }
        break;
    default:
        http_response_code(404);
        echo json_encode(array("message" => "Endpoint não encontrado."));
        break;
}
?>
