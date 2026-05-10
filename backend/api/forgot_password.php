<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../vendor/autoload.php';
require_once '../config/Database.php';
require_once '../config/Config.php';
require_once '../models/User.php';

use Config\Database;
use Config\Config;
use Models\User;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$database = new Database();
$db = $database->getConnection();
$user = new User($db);

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->email)) {
    $user->email = $data->email;
    if($user->emailExists()) {
        $token = bin2hex(random_bytes(16));
        if($user->updateResetToken($data->email, $token)) {
            
            $mail = new PHPMailer(true);

            try {
                // Server settings
                $mail->isSMTP();
                $mail->Host       = Config::$SMTP_HOST;
                $mail->SMTPAuth   = true;
                $mail->Username   = Config::$SMTP_USER;
                $mail->Password   = Config::$SMTP_PASS;
                $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
                $mail->Port       = Config::$SMTP_PORT;
                $mail->CharSet    = 'UTF-8';

                // Recipients
                $mail->setFrom(Config::$EMAIL_FROM, 'WeatherSystem');
                $mail->addAddress($data->email);

                // Content
                $resetLink = Config::$SITE_URL . "/reset-password?token=" . $token;
                $mail->isHTML(true);
                $mail->Subject = 'Recuperação de Senha - WeatherSystem';
                $mail->Body    = "
                    <div style='font-family: sans-serif; padding: 20px; color: #1f2937;'>
                        <h2 style='color: #D97706;'>Recuperação de Senha</h2>
                        <p>Olá,</p>
                        <p>Recebemos um pedido para redefinir a sua senha no <strong>WeatherSystem</strong>.</p>
                        <p>Clique no botão abaixo para criar uma nova senha:</p>
                        <a href='{$resetLink}' style='display: inline-block; padding: 10px 20px; background-color: #D97706; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;'>Redefinir Senha</a>
                        <p>Se o botão não funcionar, copie e cole este link no seu navegador:</p>
                        <p>{$resetLink}</p>
                        <hr style='border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;'>
                        <p style='font-size: 12px; color: #6b7280;'>Este link expirará em 1 hora. Se não solicitou isto, ignore este e-mail.</p>
                    </div>
                ";

                $mail->send();
                http_response_code(200);
                echo json_encode(array("message" => "Instruções de recuperação enviadas para o seu e-mail."));

            } catch (Exception $e) {
                http_response_code(200);
                echo json_encode(array(
                    "message" => "Erro ao enviar e-mail via PHPMailer: {$mail->ErrorInfo}",
                    "debug_token" => $token 
                ));
            }
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "Erro ao gerar token."));
        }
    } else {
        http_response_code(200);
        echo json_encode(array("message" => "Instruções de recuperação enviadas para o seu e-mail."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Email é obrigatório."));
}
?>
