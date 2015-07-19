<?php
session_start();
$_SESSION['net_id'] = $_SERVER["nameid"];
$_SESSION['course_id'] = $_GET['id'];
$_SESSION['user_name'] = $_SERVER["displayName"];
$_SESSION['priv_level'] = 1;
?>

<!doctype html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Session Logger</title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width">
    <!-- Place favicon.ico and apple-touch-icon.png in the root directory -->
    <!-- build:css styles/vendor.css -->
    <link type="text/css" rel="stylesheet" href="libs/ui-lightness/jquery-ui-1.10.3.custom.min.css" />
    <link rel="stylesheet" href="../bower_components/bootstrap/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="../bower_components/font-awesome/css/font-awesome.min.css">
    <link rel="styleSheet" href="../bower_components/angular-ui-grid/ui-grid.min.css"/>
    <link rel="stylesheet" href="styles/main.css">
    <!-- endbuild -->
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
                <li ng-show="user.priv_level==1" ng-class="{active:route.is_session_data}"><a href="" ng-click="setActive('/')">Data</a></li>
                <li ng-show="user.priv_level>1" ng-class="{active:route.is_log}"><a href="" ng-click="setActive('/log')">Session</a></li>
                <li ng-show="user.priv_level>1" ng-class="{active:route.is_sessions}"><a href="" ng-click="setActive('/sessions')">Summary</a></li>
                <li ng-show="user.priv_level>1" ng-class="{active:route.is_grid}"><a href="" ng-click="setActive('/grid')">Layout</a></li>
                <li ng-show="user.priv_level>1" ng-class="{active:route.is_users}"><a href="" ng-click="setActive('/users')">Users</a></li>
                <li ng-show="user.priv_level>1" ng-class="{active:route.is_admin}"><a href="" ng-click="setActive('/admin')">Admin</a></li>
            </ul>
        </div><!-- /.navbar-collapse -->
    </nav>
</div>
<!-- Add your site or application content here -->
<div class="container" ng-view=""></div>

<!-- build:js scripts/vendor.js -->
<!-- bower:js -->
<script src="bower_components/jquery/dist/jquery.min.js"></script>
<script src="bower_components/angular/angular.min.js"></script>
<script src="bower_components/angular-sanitize/angular-sanitize.min.js"></script>
<script src="bower_components/angular-route/angular-route.min.js"></script>
<script src="bower_components/angular-touch/angular-touch.min.js"></script>
<script src="bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js"></script>
<script src="bower_components/moment/min/moment.min.js"></script>
<script src="bower_components/angular-ui-grid/angular-ui-grid.min.js"></script>
<script src="bower_components/bootstrap/dist/js/bootstrap.min.js"></script>
<!-- endbower -->
<!-- endbuild -->

<!-- build:js({.tmp,app}) scripts/scripts.js -->
<script src="scripts/app.js"></script>
<script src="scripts/controllers/main.js"></script>
<script src="scripts/controllers/log.js"></script>
<script src="scripts/services/UserService.js"></script>
<script src="scripts/controllers/menu.js"></script>
<script src="scripts/controllers/sessions.js"></script>
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