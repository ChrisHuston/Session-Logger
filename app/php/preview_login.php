<?php
session_start();
class UserInfo {
    var $user_name = "";
    var $net_id = "";
    var $priv_level;
    var $section_id;
    var $section;
    var $login_error = "NONE";
    var $course_id = 0;
    var $course_name = "";
    var $k_course_id = 0;
    var $students;
    var $show_attendance = 0;
    var $show_cold_calls = 0;
    var $show_participation = 0;
    var $session_data;
    var $sessions;
    var $sections;
    var $access_code = "";
    var $hash;
    var $module_id;
    var $settings;
}

$login_result = new UserInfo();

$_POST = json_decode(file_get_contents("php://input"), true);
if (isset($_SESSION['course_id'])) {
    include("advanced_user_oo.php");
    Define('DATABASE_SERVER', $hostname);
    Define('DATABASE_USERNAME', $username);
    Define('DATABASE_PASSWORD', $password);
    Define('DATABASE_NAME', 'session_logger');

    if (!isset($_SESSION['access_code']) || $_SESSION['access_code'] != "Iw8lAT!") {
        $login_result->login_error = "Invalid access";
        echo json_encode($login_result);
        return;
    }

    $mysqli = new mysqli(DATABASE_SERVER, DATABASE_USERNAME, DATABASE_PASSWORD, DATABASE_NAME);
    $net_id = strtolower($_SESSION['net_id']);
    $course_id = $_SESSION['course_id'];

    $query = "SELECT c.course_name, c.settings, c.k_course_id, show_attendance, show_cold_calls, show_participation, m.section_id, m.priv_level, s.section, u.user_name
			FROM courses c
			LEFT JOIN course_members m
			    ON m.course_id=c.course_id AND m.net_id='$net_id'
            LEFT JOIN users u
                ON u.net_id='$net_id'
            LEFT JOIN course_sections s
                ON s.section_id=m.section_id
            WHERE c.course_id='$course_id'";

    $result = $mysqli->query($query);
    list($course_name, $settings, $k_course_id, $show_attendance, $show_cold_calls, $show_participation, $section_id, $priv_level, $section, $user_name) = $result->fetch_row();

    if ($course_name == "") {
        $login_result->login_error = "Incorrect course ID.";
        echo json_encode($login_result);
        return;
    } else if ($priv_level == "" || is_null($priv_level)) {
        $login_result->login_error = "User not registered for ".$course_name;
        echo json_encode($login_result);
        return;
    }



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

    $login_result->course_id = $course_id;
    $login_result->settings = $settings;
    $login_result->course_name = $course_name;
    $login_result->user_name = $user_name;
    $login_result->section_id = $section_id;
    $login_result->priv_level = $priv_level;
    $login_result->net_id = $net_id;
    $login_result->show_attendance = $show_attendance;
    $login_result->show_cold_calls = $show_cold_calls;
    $login_result->show_participation = $show_participation;
    $login_result->k_course_id = $k_course_id;
    $login_result->section = $section;

    $mysqli->close();
    echo json_encode($login_result);

} else {
    $login_result->login_error = "Authentication error.";
    echo json_encode($login_result);
}

?>