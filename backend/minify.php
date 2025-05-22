<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$url = 'https://www.toptal.com/developers/javascript-minifier/api/raw';

$data = json_decode(file_get_contents('php://input'), true);
$code = $data['jsCode'] ?? ' ';

if (!$code || trim($code) == '') {
    http_response_code(422);
    echo json_encode(["error" => "jsCode must not be empty"]);
    exit;
}

try {
    $ch = curl_init();

    curl_setopt_array($ch, [
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_HTTPHEADER => ["Content-Type: application/x-www-form-urlencoded"],
        CURLOPT_POSTFIELDS => http_build_query(["input" => (string) $code])
    ]);

    $minified = curl_exec($ch);

    if ($minified) {
        echo json_encode(["data" => $minified]);
        http_response_code(200);
    } else {
        echo json_encode(["error" => "Error with api"]);
        http_response_code(400);
    }
} catch (Exception $error) {
    http_response_code(500);
    echo json_encode(["error" => "Internal server error", "details" => $error->getMessage()]);
}


curl_close($ch);
?>