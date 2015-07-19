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

    $users = $_POST['users'];
    $members = $_POST['members'];
    $ids = $_POST['ids'];
    $course_id = $_SESSION['course_id'];

    $query = "INSERT INTO users (net_id, user_name, canvas_user_id) VALUES ".$users." ON DUPLICATE KEY UPDATE canvas_user_id=VALUES(canvas_user_id); ";
    $query .= "INSERT INTO course_members (course_id, net_id, section_id) VALUES ".$members." ON DUPLICATE KEY UPDATE section_id=VALUES(section_id); ";
    $query .= "DELETE FROM course_members WHERE course_id='$course_id' AND net_id NOT IN ".$ids."; ";
    $result = $mysqli->multi_query($query);

    $mysqli->close();
    echo json_encode($result);
}

?>