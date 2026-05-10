<?php
namespace Controllers;

require_once '../config/Database.php';
require_once '../config/Config.php';
require_once '../models/Favorite.php';
require_once '../models/History.php';
require_once '../utils/JwtHandler.php';

use Config\Database;
use Config\Config;
use Models\Favorite;
use Models\History;
use Utils\JwtHandler;
use PDO;

class WeatherController {
    private $db;
    private $favorite;
    private $history;
    private $jwt;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->favorite = new Favorite($this->db);
        $this->history = new History($this->db);
        $this->jwt = new JwtHandler();
    }

    private function authenticate() {
        $authData = $this->jwt->getAuthData();
        if(!$authData) {
            http_response_code(401);
            echo json_encode(array("message" => "Não autorizado."));
            exit();
        }
        return $authData->data;
    }

    public function getWeather($city, $lang = 'pt') {
        $user = $this->authenticate();
        
        // Chamar API Externa
        $url = Config::$WEATHER_API_URL . "weather?q=" . urlencode($city) . "&appid=" . Config::$WEATHER_API_KEY . "&units=metric&lang=" . $lang;
        
        $this->executeWeatherRequest($url, $user, $city);
    }

    public function getWeatherByCoords($lat, $lon, $lang = 'pt') {
        $user = $this->authenticate();
        
        // Chamar API Externa com Coordenadas
        $url = Config::$WEATHER_API_URL . "weather?lat=" . $lat . "&lon=" . $lon . "&appid=" . Config::$WEATHER_API_KEY . "&units=metric&lang=" . $lang;
        
        $this->executeWeatherRequest($url, $user, null);
    }

    private function executeWeatherRequest($url, $user, $city) {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if($httpCode == 200) {
            // Guardar no histórico usando sempre o nome oficial retornado pela API
            $responseData = json_decode($response);
            
            // Correção manual para Luanda (evitar grafias arcaicas como Loanda em Angola)
            if ($responseData->name === 'Loanda' && $responseData->sys->country === 'AO') {
                $responseData->name = 'Luanda';
            }

            $this->history->user_id = $user->id;
            $this->history->city_name = $responseData->name;
            $this->history->add();

            http_response_code(200);
            echo json_encode($responseData); // Return normalized data
        } else {
            http_response_code($httpCode);
            echo $response; // Devolver o erro da API
        }
    }

    public function getForecast($city, $lang = 'pt') {
        $user = $this->authenticate();
        $url = Config::$WEATHER_API_URL . "forecast?q=" . urlencode($city) . "&appid=" . Config::$WEATHER_API_KEY . "&units=metric&lang=" . $lang;
        $this->executeForecastRequest($url);
    }

    public function getForecastByCoords($lat, $lon, $lang = 'pt') {
        $user = $this->authenticate();
        $url = Config::$WEATHER_API_URL . "forecast?lat=" . $lat . "&lon=" . $lon . "&appid=" . Config::$WEATHER_API_KEY . "&units=metric&lang=" . $lang;
        $this->executeForecastRequest($url);
    }

    private function executeForecastRequest($url) {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        http_response_code($httpCode);
        echo $response;
    }

    public function getFavorites() {
        $user = $this->authenticate();
        $stmt = $this->favorite->getFavoritesByUser($user->id);
        $favorites = array();
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            array_push($favorites, $row);
        }
        http_response_code(200);
        echo json_encode($favorites);
    }

    public function addFavorite($data) {
        $user = $this->authenticate();
        if(!empty($data->city_name)) {
            $this->favorite->user_id = $user->id;
            $this->favorite->city_name = $data->city_name;
            $this->favorite->country_code = isset($data->country_code) ? $data->country_code : '';
            
            if($this->favorite->add()) {
                http_response_code(201);
                echo json_encode(array("message" => "Favorito adicionado."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Erro ao adicionar favorito."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Dados incompletos."));
        }
    }

    public function removeFavorite($id) {
        $user = $this->authenticate();
        if($this->favorite->delete($id, $user->id)) {
            http_response_code(200);
            echo json_encode(array("message" => "Favorito removido."));
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "Erro ao remover favorito."));
        }
    }

    public function getHistory() {
        $user = $this->authenticate();
        $stmt = $this->history->getHistoryByUser($user->id);
        $history = array();
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            array_push($history, $row);
        }
        http_response_code(200);
        echo json_encode($history);
    }
}
?>
