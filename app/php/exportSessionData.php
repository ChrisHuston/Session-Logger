<?php
session_start();
$_POST = json_decode(file_get_contents("php://input"), true);
if (isset($_SESSION['course_id'])) {
    $_SESSION['export_data'] = $_POST['csv_data'];
    $_SESSION['export_name'] = $_POST['download_name'];
    echo true;
}

?>