<?php
session_start();
$_POST = json_decode(file_get_contents("php://input"), true);
if (isset($_SESSION['net_id']) && isset($_POST['net_id'])) {
    include("advanced_user_oo.php");
    Define('DATABASE_SERVER', $hostname);
    Define('DATABASE_USERNAME', $username);
    Define('DATABASE_PASSWORD', $password);
    Define('DATABASE_NAME', 'session_logger');

    $mysqli = new mysqli(DATABASE_SERVER, DATABASE_USERNAME, DATABASE_PASSWORD, DATABASE_NAME);

    $seat_row = $_POST['seat_row'];
    $seat_col = $_POST['seat_col'];
    $course_id = $_SESSION['course_id'];
    $net_id = $_POST['net_id'];
    $section_id = $_POST['section_id'];

    if ($seat_row != -1) {
        $query = "SELECT net_id FROM course_members WHERE
        course_id='$course_id' AND section_id='$section_id' AND seat_row='$seat_row' AND seat_col='$seat_col'";

        $result = $mysqli->query($query);
        list($seat_id) = $result->fetch_row();
    }

    if (empty($seat_id)) {
        $query = "UPDATE course_members SET seat_row='$seat_row', seat_col='$seat_col'
            WHERE course_id='$course_id' AND section_id='$section_id' AND net_id='$net_id' ";
        $result = $mysqli->query($query);
        $mysqli->close();
        echo json_encode($result);
    } else {
        echo json_encode(false);
    }
} else {
    echo "Not specified";
}

?>