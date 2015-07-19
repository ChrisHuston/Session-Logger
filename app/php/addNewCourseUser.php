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
    $section = $_POST['section'];
    $net_id = $mysqli->real_escape_string(strtoupper($_POST['net_id']));
    $user_name = $mysqli->real_escape_string($_POST['user_name']);
    $user_email = $_POST['user_email'];
    $priv_level = $_POST['priv_level'];
    $course_id = $_SESSION['course_id'];

    $query = "INSERT IGNORE INTO users
                (user_name, user_email, net_id)
                VALUES
                ('$user_name', '$user_email', '$net_id'); ";

    $query .= "INSERT IGNORE INTO course_members
                (course_id, section, net_id, priv_level)
                VALUES
                ('$course_id', '$section', '$net_id', '$priv_level')";
    $result = $mysqli->multi_query($query);

    $mysqli->close();
    echo json_encode($result);
}

?>