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
        var $session_id=0;
    }

    $db_result = new DbInfo();

    $mysqli = new mysqli(DATABASE_SERVER, DATABASE_USERNAME, DATABASE_PASSWORD, DATABASE_NAME);
    $section_id = $_POST['section_id'];
    $session_date = $_POST['session_date'];
    $course_id = $_SESSION['course_id'];

    $query = "INSERT INTO sessions
                (course_id, section_id, session_date)
                VALUES
                ('$course_id', '$section_id', '$session_date')";
    $result = $mysqli->query($query);
    $db_result->session_id = $mysqli->insert_id;

    $mysqli->close();
    echo json_encode($db_result);
}

?>