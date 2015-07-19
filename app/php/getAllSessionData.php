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
        var $session_data;
    }

    $db_result = new DbInfo();

    $mysqli = new mysqli(DATABASE_SERVER, DATABASE_USERNAME, DATABASE_PASSWORD, DATABASE_NAME);
    $course_id = $_SESSION['course_id'];

    $query = "SELECT u.user_name, u.nickname, s.session_date, s.session_id, x.section, m.net_id, m.section_id, m.seat_row, m.seat_col, IFNULL(d.present,0) AS present, IFNULL(d.excused,0) AS excused, IFNULL(d.unexcused,0) AS unexcused, IFNULL(d.late,0) AS late, IFNULL(d.cold_call,0) AS cold_call, IFNULL(d.comments,0) AS comments, IFNULL(d.participation,0) AS participation, d.flag, d.notes
        FROM course_members m
        INNER JOIN users u
            ON u.net_id= m.net_id
        INNER JOIN sessions s
          ON s.course_id='$course_id' AND m.section_id=s.section_id
        LEFT JOIN session_data d
            ON d.session_id=s.session_id AND d.net_id=m.net_id
        LEFT JOIN course_sections x
            ON x.section_id=m.section_id
        WHERE m.course_id='$course_id' AND m.priv_level < 2
        ORDER BY u.user_name, s.session_date";
    $result = $mysqli->query($query);
    $json = array();
    while ($row = $result->fetch_assoc()) {
        $json[] = $row;
    }
    $db_result->session_data = $json;

    $mysqli->close();
    echo json_encode($db_result);
}

?>