'use strict';

angular.module('sessionLoggerApp')
  .controller('MenuCtrl', function ($scope, UserService, $http, $filter, $location, $window) {

        $scope.user = UserService.user;
        $scope.route = UserService.route;
        UserService.login();
        $scope.course = UserService.course;

        $scope.setActive = function(loc) {
            $scope.route.is_session_data = false;
            $scope.route.is_seating_chart = false;
            $scope.route.is_log = false;
            $scope.route.is_sessions = false;
            $scope.route.is_grid = false;
            $scope.route.is_admin = false;
            $scope.route.is_users = false;
            $scope.route.is_radmin = false;
            $scope.route.is_quiz = false;
            $('#session-navbar-collapse').collapse('hide');
            $location.path(loc);
            if (loc === "/") {
                $scope.route.is_session_data = true;
            } else if (loc === "/log") {
                $scope.route.is_log = true;
            } else if (loc === '/sessions') {
                $scope.route.is_sessions = true;
            } else if (loc === '/grid') {
                $scope.route.is_grid = true;
            } else if (loc === '/admin') {
                $scope.route.is_admin = true;
            } else if (loc === '/users') {
                $scope.route.is_users = true;
            } else if (loc === '/radmin') {
                $scope.route.is_radmin = true;
            } else if (loc === '/seating') {
                $scope.route.is_seating_chart = true;
            } else if (loc === '/respond') {
                $scope.route.is_quiz = true;
            }
        };

        $scope.popout = function() {
            $window.open("https://www.kblocks.com/app/sessions/index_lti.php");
        }



    });

