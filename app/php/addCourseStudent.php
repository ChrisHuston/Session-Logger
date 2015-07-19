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
    $section = $_POST['section'];
    $net_id = $_POST['net_id'];
    $priv_level = $_POST['priv_level'];
    $course_id = $_SESSION['course_id'];

    $query = "INSERT INTO course_members
                (course_id, section, net_id, priv_level)
                VALUES
                ('$course_id', '$section', '$net_id', '$priv_level')";
    $result = $mysqli->query($query);

    $mysqli->close();
    echo json_encode($result);
}

?>