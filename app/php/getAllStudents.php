<?php
session_start();
$_POST = json_decode(file_get_contents("php://input"), true);
if (isset($_SESSION['course_id'])) {
    include("advanced_user_oo.php");
    Define('DATABASE_SERVER', $hostname);
    Define('DATABASE_USERNAME', $username);
    Define('DATABASE_PASSWORD', $password);
    Define('DATABASE_NAME', 'session_logger');

    class DbInfo {
        var $all_students;
    }

    $db_result = new DbInfo();

    $mysqli = new mysqli(DATABASE_SERVER, DATABASE_USERNAME, DATABASE_PASSWORD, DATABASE_NAME);
    $course_id = $_SESSION['course_id'];

    $query = "SELECT u.user_name, u.net_id, u.user_img
        FROM users u
        LEFT JOIN course_members m
          ON u.net_id= m.net_id AND m.course_id='$course_id'
        WHERE ISNULL(m.net_id) ORDER BY u.user_name";

    $result = $mysqli->query($query);
    $json = array();
    while ($row = $result->fetch_assoc()) {
        $json[] = $row;
    }
    $db_result->all_students = $json;

    $mysqli->close();
    echo json_encode($db_result);
} else {
    echo json_encode("Not authenticated");
}

?>