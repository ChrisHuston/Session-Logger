'use strict';

angular.module('sessionLoggerApp')
  .controller('GridCtrl', function ($scope, UserService, $http) {
        if (UserService.course.sections.length > 0) {
            $scope.currentSection = UserService.course.sections[0];
        } else {
            $scope.currentSection = null;
        }
        $scope.course = UserService.course;
        $scope.user = UserService.user;
        $scope.selectedStudent = {};

        $scope.selectStudent = function(student) {
            $scope.selectedStudent = student;
        };

        $scope.saveStudentPosition = function(cell) {
            var uniqueSuffix = "?" + new Date().getTime();
            var params = {};
            params.net_id = cell.student.net_id;
            params.seat_row = cell.student.seat_row;
            params.seat_col = cell.student.seat_col;
            params.section_id = $scope.currentSection.section_id;
            $http({method: 'POST',
                url: UserService.appDir + 'php/setStudentPos.php' + uniqueSuffix,
                data: params,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).
                success(function() {
                }).
                error(function(data, status) {
                    alert("Error: " + status + " Change student position failed. Check your internet connection");
                });
        };

        $scope.setStudentPosition = function(cell) {
            cell.student = $scope.selectedStudent;
            $scope.selectedStudent.seat_row = cell.row;
            $scope.selectedStudent.seat_col = cell.column;
            $scope.saveStudentPosition(cell);
            $scope.selectedStudent = null;
        };

        $scope.filterStudents = function(student) {
            return $scope.currentSection.section_id === student.section_id && student.seat_row === -1;
        };

        $scope.removeStudent = function(cell) {
            cell.student.seat_row = -1;
            cell.student.seat_col = -1;
            $scope.saveStudentPosition(cell);
            cell.student = null;
        };

        $scope.changeSection = function() {
            UserService.makeClassroom($scope.currentSection);
            angular.forEach($scope.course.students, function(s) {
                if (s.seat_row !== -1 && s.section_id === $scope.currentSection.section_id) {
                    if ($scope.course.grid.length > s.seat_row && $scope.course.grid[s.seat_row].length > s.seat_col) {
                        $scope.course.grid[s.seat_row][s.seat_col].student = s;
                    } else {
                        s.seat_col = -1;
                        s.seat_row = -1;
                    }

                }
            });
        };

        $scope.changeSection();
  });
