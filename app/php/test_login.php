<?php
session_start();
class UserInfo {
    var $user_name = "";
    var $user_email = "";
    var $net_id = "";
    var $priv_level;
    var $section;
    var $login_error = "NONE";
    var $course_id = 0;
    var $course_name = "";
    var $course_link = "";
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
if (isset($_POST['course_id'])) {
    include("advanced_user_oo.php");
    Define('DATABASE_SERVER', $hostname);
    Define('DATABASE_USERNAME', $username);
    Define('DATABASE_PASSWORD', $password);
    Define('DATABASE_NAME', 'session_logger');

    $mysqli = new mysqli(DATABASE_SERVER, DATABASE_USERNAME, DATABASE_PASSWORD, DATABASE_NAME);
    $user_email = $_POST['user_email'];
    $user_name = $_POST['user_name'];
    $net_id = strtoupper($_POST['net_id']);
    $course_id = $_POST['course_id'];

    $query = "SELECT c.course_name, c.settings, course_link, c.is_open, c.k_course_id, show_attendance, show_cold_calls, show_participation, m.priv_level, m.section
		FROM courses c
		LEFT JOIN course_members m
		  ON m.course_id='$course_id' AND m.net_id='$net_id'
        WHERE c.course_id='$course_id'";

    $result = $mysqli->query($query);
    list($course_name, $settings, $course_link, $is_open, $k_course_id, $show_attendance, $show_cold_calls, $show_participation, $priv_level, $section) = $result->fetch_row();


    if ($course_name == "") {
        $login_result->login_error = "Incorrect course ID.";
        echo json_encode($login_result);
        return;
    } else if ($priv_level == "" || is_null($priv_level)) {
        if ($is_open == '1') {
            $query = "INSERT IGNORE INTO users (net_id, user_email, user_name) VALUES
            ('$net_id', '$user_email', '$user_name'); ";

            $query .= "INSERT INTO course_members (net_id, course_id, section, priv_level, seat_row, seat_col)
            VALUES ('$net_id', '$course_id', '1', '1', '-1', '-1'); ";

            $mysqli->multi_query($query);
            $priv_level = 1;
            $section = 1;
        } else {
            $login_result->login_error = "User not registered for ".$course_name;
            echo json_encode($login_result);
            return;
        }
    }

    if ($priv_level>1) {
        $query = "SELECT u.user_name, u.nickname, u.user_img, m.net_id, m.section, seat_row, seat_col
        FROM course_members m
        INNER JOIN users u
            ON u.net_id= m.net_id
        WHERE m.course_id='$course_id' AND m.priv_level='1'
        ORDER BY m.section, u.user_name; ";

        $query .= "SELECT session_id, section, session_date
        FROM sessions m
        WHERE m.course_id='$course_id'
        ORDER BY section, session_date; ";

        $query .= "SELECT section, room_id
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
            $query .= "d.present, d.late, d.excused, ";
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
        WHERE s.course_id='$course_id' AND s.section='$section'
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
    $login_result->course_link = $course_link;
    $login_result->user_name = $user_name;
    $login_result->section = $section;
    $login_result->user_email = $user_email;
    $login_result->priv_level = $priv_level;
    $login_result->net_id = $net_id;
    $login_result->show_attendance = $show_attendance;
    $login_result->show_cold_calls = $show_cold_calls;
    $login_result->show_participation = $show_participation;
    $login_result->k_course_id = $k_course_id;

    $mysqli->close();
    $_SESSION['email'] = $user_email;
    $_SESSION['net_id'] = $net_id;
    $_SESSION['user_name'] = $user_name;
    $_SESSION['course_id'] = $course_id;
    $_SESSION['priv_level'] = $priv_level;
    echo json_encode($login_result);

} else {
    $login_result->login_error = "Authentication error.";
    echo json_encode($login_result);
}

?>