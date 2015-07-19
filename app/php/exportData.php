<?php
session_start();
$_POST = json_decode(file_get_contents("php://input"), true);
if (isset($_SESSION['course_id'])) {

    $download_name = $_POST['download_name'];
    $csv_data = $_POST['csv_data'];

    header('Content-Disposition: attachement; filename="'.$download_name.'";');
    header('Content-Type: text/csv');

    $fiveMBs = 5 * 1024 * 1024;
    $fp = fopen("php://temp/maxmemory:$fiveMBs", 'r+');

    fputs($fp, $csv_data);
    rewind($fp);
    echo stream_get_contents($fp);
}

?>