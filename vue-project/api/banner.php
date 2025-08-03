<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$conn = new mysqli('127.0.0.1', 'root', 'root', 'web');
if ($conn->connect_error) {
    die(json_encode(['error' => '数据库连接失败: ' . $conn->connect_error]));
}

$conn->set_charset("utf8");
$sql = "SELECT image_url FROM company_slides ORDER BY id";
$result = $conn->query($sql);

$data = [];
while($row = $result->fetch_assoc()) {
    $data[] = $row['image_url'];
}

echo json_encode($data);
?>