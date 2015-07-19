<?php
session_start();
$_POST = json_decode(file_get_contents("php://input"), true);
if (isset($_SESSION['course_id'])) {
    include("advanced_user_oo.php");
    Define('DATABASE_SERVER', $hostname);
    Define('DATABASE_USERNAME', $username);
    Define('DATABASE_PASSWORD', $password);
    Define('DATABASE_NAME', 'session_logger');

    $mysqli = new mysqli(DATABASE_SERVER, DATABASE_USERNAME, DATABASE_PASSWORD, DATABASE_NAME);
    $session_id = $_POST['session_id'];
    $net_id = $_POST['net_id'];
    $present = $_POST['present'];

    $query = "INSERT INTO session_data
                (session_id, net_id, present)
                VALUES
                ('$session_id', '$net_id', '$present')
                ON DUPLICATE KEY UPDATE present='$present'";
    $result = $mysqli->query($query);
    $mysqli->close();
    echo json_encode($result);
}

?>