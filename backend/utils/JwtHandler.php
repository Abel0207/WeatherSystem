<?php
namespace Utils;

class JwtHandler {
    private $secret = "O_SEU_SEGREDO_SUPER_SEGURO_AQUI"; // Idealmente viria de variáveis de ambiente

    public function generateToken($data) {
        $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
        $payload = json_encode([
            'iss' => 'weather_system',
            'aud' => 'weather_system_client',
            'iat' => time(),
            'nbf' => time(),
            'exp' => time() + 3600, // 1 hora
            'data' => $data
        ]);

        $base64UrlHeader = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
        $base64UrlPayload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload));
        $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, $this->secret, true);
        $base64UrlSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));

        return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
    }

    public function decodeToken($jwt) {
        $tokenParts = explode('.', $jwt);
        if(count($tokenParts) != 3) {
            return false;
        }

        $header = base64_decode(str_replace(['-', '_'], ['+', '/'], $tokenParts[0]));
        $payload = base64_decode(str_replace(['-', '_'], ['+', '/'], $tokenParts[1]));
        $signatureProvided = $tokenParts[2];

        $base64UrlHeader = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
        $base64UrlPayload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload));
        $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, $this->secret, true);
        $base64UrlSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));

        if($base64UrlSignature === $signatureProvided) {
            $payloadObj = json_decode($payload);
            if($payloadObj->exp < time()) {
                return false; // Expirado
            }
            return $payloadObj;
        }
        return false;
    }

    public function getAuthData() {
        $authHeader = null;
        if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
            $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
        } elseif (function_exists('apache_request_headers')) {
            $headers = apache_request_headers();
            if (isset($headers['Authorization'])) {
                $authHeader = $headers['Authorization'];
            }
        }

        if ($authHeader) {
            $arr = explode(" ", $authHeader);
            $jwt = $arr[1] ?? '';
            if ($jwt) {
                return $this->decodeToken($jwt);
            }
        }

        // Permitir token via GET para download de ficheiros
        if (isset($_GET['token'])) {
            return $this->decodeToken($_GET['token']);
        }

        return false;
    }
}
?>
