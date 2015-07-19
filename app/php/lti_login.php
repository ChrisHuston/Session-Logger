<?php
session_start();
class UserInfo {
    var $user_name = "";
    var $net_id = "";
    var $priv_level;
    var $section_id;
    var $section;
    var $room_id;
    var $login_error = "NONE";
    var $course_id = 0;
    var $course_name = "";
    var $k_course_id = 0;
    var $students;
    var $show_attendance = 0;
    var $show_cold_calls = 0;
    var $show_participation = 0;
    var $show_seating = 0;
    var $enable_seating = 0;
    var $show_quiz = 0;
    var $session_data;
    var $sessions;
    var $sections;
    var $access_code = "";
    var $hash;
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

    $mysqli = new mysqli(DATABASE_SERVER, DATABASE_USERNAME, DATABASE_PASSWORD, DATABASE_NAME);
    $user_name = $_SESSION['full_name'];
    $net_id = $_SESSION['net_id'];
    $course_id = $_SESSION['course_id'];
    $priv_level = $_SESSION['priv_level'];
    $canvas_user_id = $_SESSION['canvas_user_id'];

    if ($user_name === 'Test Student') {
        $query = "SELECT c.course_name, c.settings, c.k_course_id, show_attendance, show_cold_calls, show_participation, show_seating, enable_seating, show_quiz, s.section_id, s.section, s.room_id
			FROM courses c
            INNER JOIN course_sections s
                ON s.course_id=c.course_id
            WHERE c.course_id='$course_id' LIMIT 1";
    } else {
        $query = "SELECT c.course_name, c.settings, c.k_course_id, show_attendance, show_cold_calls, show_participation, show_seating, enable_seating, show_quiz, m.section_id, s.section, s.room_id
			FROM courses c
			LEFT JOIN course_members m
			    ON m.net_id='$net_id' AND m.course_id=c.course_id
            LEFT JOIN course_sections s
                ON s.section_id=m.section_id
            WHERE c.course_id='$course_id'";
    }


    $result = $mysqli->query($query);
    list($course_name, $settings, $k_course_id, $show_attendance, $show_cold_calls, $show_participation, $show_seating, $enable_seating, $show_quiz, $section_id, $section, $room_id) = $result->fetch_row();

    $result->close();

    if ($course_name == "") {
        if ($priv_level > 1) {
            $settings = '{"show_present":true,"show_late":true,"show_excused":true,"show_unexcused":true,"show_counter":true,"show_flag":true,"show_notes":true,"show_coldcall":true,"show_participation":true}';
            $course_name = $course_id;
            $query = "INSERT INTO courses (course_id, course_name, settings) VALUES ('$course_id', '$course_name', '$settings')";
            $mysqli->query($query);
        } else {
            $login_result->login_error = "Course not setup for ".$course_id;
            echo json_encode($login_result);
            return;
        }
    }

    if ($priv_level>1) {
        if (is_null($section_id)) {
            $query = "INSERT INTO course_members (course_id, net_id, priv_level)
                VALUES ('$course_id', '$net_id', '$priv_level')
                ON DUPLICATE KEY UPDATE priv_level='$priv_level'; ";
            $mysqli->query($query);
        }

        $query = "SELECT u.user_name, u.nickname, u.user_img, u.canvas_img, u.canvas_user_id, m.net_id, m.section_id, seat_row, seat_col, s.section
        FROM course_members m
        INNER JOIN users u
            ON u.net_id= m.net_id
        INNER JOIN course_sections s
            ON s.section_id=m.section_id AND s.course_id=m.course_id
        WHERE m.course_id='$course_id' AND m.priv_level='1'
        ORDER BY s.section, u.user_name; ";

        $query .= "SELECT session_id, s.section_id, session_date, s.module_id, s.open_time, s.close_time, c.section
        FROM sessions s
        INNER JOIN course_sections c
            ON c.section_id=s.section_id AND c.course_id=s.course_id
        WHERE s.course_id='$course_id'
        ORDER BY session_date, c.section; ";

        $query .= "SELECT section, section_id, room_id, alphabetic
        FROM course_sections
        WHERE course_id='$course_id'
        ORDER BY section ASC; ";

        $mysqli->multi_query($query);

        $mysqli->next_result();
        $result = $mysqli->store_result();
        $json = array();
        while ($row = $result->fetch_assoc()) {
            $json[] = $row;
        }
        $login_result->students = $json;

        $mysqli->next_result();
        $result = $mysqli->store_result();
        $json = array();
        while ($row = $result->fetch_assoc()) {
            $json[] = $row;
        }
        $login_result->sessions = $json;

        $mysqli->next_result();
        $result = $mysqli->store_result();
        $json = array();
        while ($row = $result->fetch_assoc()) {
            $json[] = $row;
        }
        $login_result->sections = $json;
        $login_result->access_code = "Iw8lAT!";
    } else if ($show_attendance == 1 || $show_cold_calls == 1 || $show_participation == 1) {
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
        $query .= " s.session_date, s.module_id, s.open_time, s.close_time
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
    $login_result->room_id = $room_id;
    $login_result->priv_level = $priv_level;
    $login_result->net_id = $net_id;
    $login_result->show_attendance = $show_attendance;
    $login_result->show_cold_calls = $show_cold_calls;
    $login_result->show_participation = $show_participation;
    $login_result->show_seating = $show_seating;
    $login_result->enable_seating = $enable_seating;
    $login_result->k_course_id = $k_course_id;
    $login_result->section = $section;


    $mysqli->close();
    echo json_encode($login_result);

} else {
    $login_result->login_error = "Authentication error.";
    echo json_encode($login_result);
}

?>