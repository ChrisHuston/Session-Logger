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
        var $sections;
    }

    $db_result = new DbInfo();

    $mysqli = new mysqli(DATABASE_SERVER, DATABASE_USERNAME, DATABASE_PASSWORD, DATABASE_NAME);
    $course_id = $_SESSION['course_id'];

    $token = "YourToken";
    $url = "https://YourCanvasUrl/api/v1/courses/".$course_id."/sections";

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HEADER, 0);
    $headers = array('Authorization: Bearer ' . $token);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    //curl_setopt($ch,CURLOPT_POST, count($fields));
    //curl_setopt($ch,CURLOPT_POSTFIELDS, $fields_query);
    $event_data = curl_exec($ch);
    curl_close($ch);

    $db_result->sections = $event_data;

    $mysqli->close();
    echo json_encode($db_result);
} else {
    echo json_encode("Not authenticated");
}

?>