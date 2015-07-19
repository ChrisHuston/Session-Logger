<?php
session_start();
require_once 'ims-blti/blti.php';
// Initialize, all secrets are 'secret', do not set session, and do not redirect
$context = new BLTI("YourSecret", false, false);

if ( $context->valid ) {
    if (isset($_POST['custom_canvas_course_id'])) {
        $_SESSION['course_id'] = $_POST['custom_canvas_course_id'];
        $_SESSION['net_id'] = strtolower($_POST['custom_canvas_user_login_id']);
        $_SESSION['family_name'] = $_POST['lis_person_name_family'];
        $_SESSION['given_name'] = $_POST['lis_person_name_given'];
        $_SESSION['full_name'] = $_POST['lis_person_name_full'];
        $_SESSION['canvas_user_id'] = $_POST['custom_canvas_user_id'];
        $_SESSION['is_lti'] = true;
        $roles = $_POST['roles'];
        if (strpos($roles, 'Administrator') !== false || strpos($roles, 'Instructor') !== false || strpos($roles, 'Designer') !== false || strpos($roles, 'ContentDeveloper') !== false) {
            $_SESSION['priv_level'] = 3;
        } else if (strpos($roles, 'TeachingAssistant') !== false) {
            $_SESSION['priv_level'] = 2;
        } else {
            $_SESSION['priv_level'] = 1;
        }
        //$_SESSION['roles'] = $roles;
        //header("location: index_lti.php?session_id=". $session_id );
    }
}
?>

<!doctype html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Session Logger</title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link type="text/css" rel="stylesheet" href="libs/ui-lightness/jquery-ui-1.10.3.custom.min.css" />
    <link rel="stylesheet" href="../bower_components/bootstrap/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="../bower_components/font-awesome/css/font-awesome.min.css">
    <link rel="styleSheet" href="../bower_components/angular-ui-grid/ui-grid.min.css"/>
    <link rel="stylesheet" href="styles/main.css">
</head>
<body ng-app="sessionLoggerApp">
<div ng-controller="MenuCtrl">
    <nav class="navbar navbar-default navbar-fixed-top no-print" role="navigation">
        <!-- Brand and toggle get grouped for better mobile display -->
        <div class="navbar-header">
            <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#session-navbar-collapse">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
        </div>

        <!-- Collect the nav links, forms, and other content for toggling -->
        <div class="collapse navbar-collapse" id="session-navbar-collapse">
            <ul class="nav navbar-nav">
                <li ng-show="user.priv_level==1 && course.show_data" ng-class="{active:route.is_session_data}"><a href="" ng-click="setActive('/')">Data</a></li>
                <li ng-show="user.priv_level==1 && course.show_seating" ng-class="{active:route.is_seating_chart}"><a href="" ng-click="setActive('/seating')">Seating</a></li>
                <li ng-show="user.priv_level>1" ng-class="{active:route.is_log}"><a href="" ng-click="setActive('/log')">Session</a></li>
                <li ng-show="user.priv_level>1" ng-class="{active:route.is_sessions}"><a href="" ng-click="setActive('/sessions')">Summary</a></li>
                <li ng-show="user.priv_level>1" ng-class="{active:route.is_grid}"><a href="" ng-click="setActive('/grid')">Layout</a></li>
                <li ng-show="user.priv_level>1" ng-class="{active:route.is_users}"><a href="" ng-click="setActive('/users')">Users</a></li>
                <li ng-show="user.priv_level>1" ng-class="{active:route.is_admin}"><a href="" ng-click="setActive('/admin')">Admin</a></li>
                <li><a href="https://your_server_url/app/sessions/index_lti.php" target="_blank"><i class="fa fa-external-link"></i> Full View</a></li>
            </ul>
        </div><!-- /.navbar-collapse -->
    </nav>
</div>
<!-- Add your site or application content here -->
<div class="container" ng-view=""></div>

<!-- build:js scripts/vendor.js -->
<!-- bower:js -->
<script src="../bower_components/jquery/dist/jquery.min.js"></script>
<script type="text/javascript" src="libs/jquery-ui-1.10.3.custom.min.js"></script>
<script src="../bower_components/angular/angular.min.js"></script>
<script src="../bower_components/angular-route/angular-route.min.js"></script>
<script src="../bower_components/angular-sanitize/angular-sanitize.min.js"></script>
<script src="../bower_components/angular-touch/angular-touch.min.js"></script>
<script src="../bower_components/angular-bootstrap/ui-bootstrap.min.js"></script>
<script src="../bower_components/moment/min/moment.min.js"></script>
<script src="../bower_components/bootstrap/dist/js/bootstrap.min.js"></script>
<!-- endbower -->
<!-- endbuild -->

<!-- build:js({.tmp,app}) scripts/scripts.js -->
<script src="scripts/app.js"></script>
<script src="scripts/controllers/main.js"></script>
<script src="scripts/controllers/log.js"></script>
<script src="scripts/services/UserService.js"></script>
<script src="scripts/controllers/menu.js"></script>
<script src="scripts/controllers/sessions.js"></script>
<script src="scripts/controllers/seating.js"></script>
<script src="scripts/controllers/grid.js"></script>
<script src="scripts/controllers/admin.js"></script>
<script src="scripts/controllers/users.js"></script>
<!-- endbuild -->
<script src="//tinymce.cachefly.net/4.2/tinymce.min.js"></script>
<script src="../bower_components/lodash/dist/lodash.min.js"></script>
<script src="../bower_components/angular-ui-grid/csv.js"></script>
<script src="../bower_components/angular-ui-grid/ui-grid.min.js"></script>
<script type="text/javascript" src="../bower_components/d3/d3.min.js"></script>
</body>
</html>