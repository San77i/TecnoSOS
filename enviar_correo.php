<?php
// 1. Encabezados CORS (Acepta cualquier origen para evitar bloqueos)
header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, X-Requested-With");

// Responder rápido a la verificación del navegador
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $destinatario = "info@tecnosos.net"; 

    // Recibir datos
    $nombre = htmlspecialchars(trim($_POST['name'] ?? ''));
    $email_remitente = htmlspecialchars(trim($_POST['email'] ?? ''));
    $telefono = htmlspecialchars(trim($_POST['phone'] ?? ''));
    $mensaje = htmlspecialchars(trim($_POST['message'] ?? ''));

    if (empty($nombre) || empty($email_remitente) || empty($mensaje)) {
        http_response_code(400);
        exit("Faltan datos");
    }

    $asunto_mail = "Cotización/Contacto TecnoSOS: " . $nombre;

    $cuerpo_mensaje = "Nuevo mensaje desde TecnoSOS\n\n";
    $cuerpo_mensaje .= "Nombre: $nombre\n";
    $cuerpo_mensaje .= "Email: $email_remitente\n";
    $cuerpo_mensaje .= "Teléfono: $telefono\n\n";
    $cuerpo_mensaje .= "Mensaje:\n$mensaje\n";

    // El remitente debe ser del dominio para no caer en SPAM
    $cabeceras = "From: TecnoSOS Web <info@tecnosos.net>\r\n"; 
    $cabeceras .= "Reply-To: " . $email_remitente . "\r\n";
    $cabeceras .= "Content-type: text/plain; charset=UTF-8\r\n";

    if (mail($destinatario, $asunto_mail, $cuerpo_mensaje, $cabeceras)) {
        http_response_code(200);
        echo "OK";
    } else {
        http_response_code(500);
        echo "Error Mail";
    }
}
?>