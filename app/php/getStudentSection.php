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
        var $section_seating;
    }

    $db_result = new DbInfo();

    $mysqli = new mysqli(DATABASE_SERVER, DATABASE_USERNAME, DATABASE_PASSWORD, DATABASE_NAME);
    $section_id = $_POST['section_id'];
    $course_id = $_SESSION['course_id'];
    $net_id = $_SESSION['net_id'];

    $query = "SELECT u.user_name, u.nickname, u.user_img, u.canvas_img, m.net_id, m.seat_row, m.seat_col
        FROM course_members m
        INNER JOIN users u
            ON u.net_id= m.net_id
        WHERE m.course_id='$course_id' AND m.section_id='$section_id' AND (m.seat_row != '-1' OR m.net_id='$net_id')
        ORDER BY u.user_name";
    $result = $mysqli->query($query);
    $json = array();
    while ($row = $result->fetch_assoc()) {
        $json[] = $row;
    }
    $db_result->section_seating = $json;

    $mysqli->close();
    echo json_encode($db_result);
}

?>