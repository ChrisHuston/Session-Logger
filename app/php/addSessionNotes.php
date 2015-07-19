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
    $notes = $mysqli->real_escape_string($_POST['notes']);

    $query = "INSERT INTO session_data
                (session_id, net_id, present, cold_call, participation, flag, notes)
                VALUES
                ('$session_id', '$net_id', '0', '0', '0', '0', '$notes')
                ON DUPLICATE KEY UPDATE
                notes='$notes'";
    $result = $mysqli->query($query);
    $mysqli->close();
    echo json_encode($result);
}

?>