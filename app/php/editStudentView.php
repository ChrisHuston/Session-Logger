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
    $course_id = $_SESSION['course_id'];
    $show_attendance = $_POST['show_attendance'];
    $show_cold_calls = $_POST['show_cold_calls'];
    $show_participation = $_POST['show_participation'];
    $show_seating = $_POST['show_seating'];
    $enable_seating = $_POST['enable_seating'];
    $show_quiz = $_POST['show_quiz'];

    $query = "UPDATE courses SET show_attendance='$show_attendance', show_cold_calls='$show_cold_calls',
    show_participation='$show_participation', show_seating='$show_seating', enable_seating='$enable_seating',
    show_quiz='$show_quiz'
    WHERE course_id='$course_id'";
    $result = $mysqli->query($query);

    $mysqli->close();
    echo json_encode($result);
}

?>