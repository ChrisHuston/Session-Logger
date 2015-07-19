'use strict';

/**
 * @ngdoc function
 * @name sessionLoggerApp.controller:SeatingCtrl
 * @description
 * # SeatingCtrl
 * Controller of the sessionLoggerApp
 */
angular.module('sessionLoggerApp')
  .controller('SeatingCtrl', function ($scope, UserService, $http) {
        $scope.course = UserService.course;
        $scope.user = UserService.user;
        $scope.user.is_seated = false;

        var getStudentSection = function() {
            var db_call = UserService.getStudentSection(UserService.user.section.section_id);
            db_call.success(function(data) {
                angular.forEach(data.section_seating, function(s) {
                    UserService.initStudentSeat(s);
                });
                $scope.course.students = data.section_seating;
                UserService.makeClassroom(UserService.user.section);
                angular.forEach(data.section_seating, function(s) {
                    if (s.seat_row !== -1) {
                        if ($scope.course.grid.length > s.seat_row && $scope.course.grid[s.seat_row].length > s.seat_col) {
                            $scope.course.grid[s.seat_row][s.seat_col].student = s;
                            if (s.net_id === $scope.user.net_id) {
                                $scope.user.is_seated = true;
                                $scope.user.student = s;
                            }
                        }
                    } else {
                        $scope.user.student = s;
                    }

                });
            });
        };

        if (!$scope.course.students) {
            getStudentSection();
        }

        $scope.saveStudentPosition = function(cell, assign_seat) {
            var uniqueSuffix = "?" + new Date().getTime();
            var params = {};
            params.net_id = $scope.user.net_id;
            params.seat_row = cell.student.seat_row;
            params.seat_col = cell.student.seat_col;
            params.section_id = $scope.user.section.section_id;
            $http({method: 'POST',
                url: UserService.appDir + 'php/setStudentPos.php' + uniqueSuffix,
                data: params,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).
                success(function(data) {
                    if (data !== 'false' && assign_seat) {
                        $scope.user.student.seat_row = cell.row;
                        $scope.user.student.seat_col = cell.column;
                        cell.student = angular.copy($scope.user.student);
                        $scope.user.is_seated = true;
                    } else if (assign_seat) {
                        alert("Seat already taken by another student.");
                    }
                }).
                error(function(data, status) {
                    alert("Error: " + status + " Change student position failed. Check your internet connection");
                });
        };

        $scope.setStudentPosition = function(cell) {
            cell.student = {seat_row:cell.row, seat_col:cell.column};
            $scope.saveStudentPosition(cell, true);
        };

        $scope.removeStudent = function(cell) {
            cell.student.seat_row = -1;
            cell.student.seat_col = -1;
            $scope.user.student.seat_row = -1;
            $scope.user.student.seat_col = -1;
            $scope.user.is_seated = false;
            $scope.saveStudentPosition(cell, false);
            cell.student = null;
        };
  });
