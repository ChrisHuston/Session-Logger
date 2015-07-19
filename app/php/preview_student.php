<?php
session_start();
class UserInfo {
    var $section = 1;
    var $section_id = 0;
    var $priv_level;
    var $show_attendance = 0;
    var $show_cold_calls = 0;
    var $show_participation = 0;
    var $session_data;
}
$login_result = new UserInfo();

$_POST = json_decode(file_get_contents("php://input"), true);
if (isset($_SESSION['course_id'])) {
    include("advanced_user_oo.php");
    Define('DATABASE_SERVER', $hostname);
    Define('DATABASE_USERNAME', $username);
    Define('DATABASE_PASSWORD', $password);
    Define('DATABASE_NAME', 'session_logger');

    $mysqli = new mysqli(DATABASE_SERVER, DATABASE_USERNAME, DATABASE_PASSWORD, DATABASE_NAME);
    $net_id = strtoupper($_POST['net_id']);
    $course_id = $_SESSION['course_id'];

    $query = "SELECT c.course_name, show_attendance, show_cold_calls, show_participation, m.priv_level, m.section_id
			FROM courses c
			LEFT JOIN course_members m
			  ON m.course_id='$course_id' AND m.net_id='$net_id'
            WHERE c.course_id='$course_id'";

    $result = $mysqli->query($query);
    list($course_name, $show_attendance, $show_cold_calls, $show_participation, $priv_level, $section_id) = $result->fetch_row();

    if ($show_attendance == 1 || $show_cold_calls == 1 || $show_participation == 1) {
        $query = "SELECT ";
        if ($show_attendance == 1) {
            $query .= "d.present, d.late, d.excused, d.unexcused, ";
        }
        if ($show_cold_calls == 1) {
            $query .= "d.cold_call, ";
        }
        if ($show_participation == 1) {
            $query .= "d.participation, ";
        }
        $query .= " s.session_date
        FROM sessions s
        LEFT JOIN session_data d
          ON d.net_id='$net_id' AND s.session_id=d.session_id
        WHERE s.course_id='$course_id' AND s.section_id='$section_id'
        ORDER BY s.session_date ASC";

        $result = $mysqli->query($query);
        $json = array();
        while ($row = $result->fetch_assoc()) {
            $json[] = $row;
        }
        $login_result->session_data = $json;
    }

    $login_result->priv_level = $priv_level;
    $login_result->net_id = $net_id;
    $login_result->section = $section;
    $login_result->section_id = $section_id;
    $login_result->show_attendance = $show_attendance;
    $login_result->show_cold_calls = $show_cold_calls;
    $login_result->show_participation = $show_participation;

    $mysqli->close();
    echo json_encode($login_result);

} else {
    $login_result->login_error = "Authentication error.";
    echo json_encode($login_result);
}

?>