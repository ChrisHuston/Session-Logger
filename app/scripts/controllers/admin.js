'use strict';

angular.module('sessionLoggerApp')
  .controller('AdminCtrl', function ($scope, $http, UserService) {
        $scope.course = UserService.course;
        $scope.classrooms = UserService.classrooms;
        $scope.all_students = [];
        $scope.showGrid = false;
        if (UserService.course.sections.length > 0) {
            $scope.currentSection = UserService.course.sections[0];
        } else {
            $scope.currentSection = null;
        }


        $scope.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened = true;
        };

        $scope.openSessionEdit = function($event, s) {
            $event.preventDefault();
            $event.stopPropagation();

            s.opened = true;
        };

        $scope.dateOptions = {
            'show-weeks': false,
            'starting-day': 0
        };

        $scope.format = 'yyyy-MM-dd';

        $scope.getSections = function() {
            var uniqueSuffix = "?" + new Date().getTime();
            var php_script;
            php_script = "getSections.php";
            var params = {};
            $http({method: 'POST',
                url: UserService.appDir + 'php/' + php_script + uniqueSuffix,
                data: params,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).
                success(function(data) {
                    var sections = JSON.parse(data.sections);
                    sections = _.sortBy(sections, function(s) {return s.id;});
                    var section_num = 1;
                    var inserts = "";
                    angular.forEach(sections, function(s) {
                        var has_section = _.find($scope.course.sections, function(sect) {
                            return parseInt(sect.section_id) === s.id;
                        });
                        if (has_section === undefined) {
                            var dash_split = s.name.split("-");
                            if (dash_split.length > 1) {
                                section_num = parseInt(dash_split[dash_split.length-1]);
                            } else {
                                section_num += 1;
                            }
                            s.section = section_num;
                            s.section_name = 'Section ' + s.section_num;
                            s.canvas_course_id = UserService.course.course_id;
                            s.section_id = s.id;
                            var values = "(" + UserService.course.course_id + "," + section_num + "," + s.section_id + "), ";
                            inserts += values;
                            $scope.course.sections.push(s);
                        }

                    });
                    if (inserts !== "") {
                        inserts = inserts.slice(0,-2);
                        addSections(inserts);
                    }
                }).
                error(function(data, status) {
                    alert( "Error: " + status + " Get sections failed. Check your internet connection");
                });
        };

        var addSections = function(inserts) {
            var uniqueSuffix = "?" + new Date().getTime();
            var php_script;
            php_script = "addSections.php";
            var params = {};
            params.inserts = inserts;
            $http({method: 'POST',
                url: UserService.appDir + 'php/' + php_script + uniqueSuffix,
                data: params,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).
                success(function(data) {
                    console.log(data);
                }).
                error(function(data, status) {
                    alert( "Error: " + status + " Add sections failed. Check your internet connection");
                });
        };

        $scope.changeSectionNumber = function(s) {
            var uniqueSuffix = "?" + new Date().getTime();
            var php_script;
            php_script = "changeSectionNumber.php";
            var params = {};
            params.section_id = s.section_id;
            params.section = s.section;
            $http({method: 'POST',
                url: UserService.appDir + 'php/' + php_script + uniqueSuffix,
                data: params,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).
                success(function(data) {
                    s.section_name = "Section " + s.section;
                }).
                error(function(data, status) {
                    alert( "Error: " + status + " Change section number failed. Check your internet connection");
                });
        };

        $scope.addSession = function() {
            if (!$scope.dt) {
                alert("Select a date for the class session.");
                return;
            }
            var uniqueSuffix = "?" + new Date().getTime();
            var php_script;
            php_script = "addSession.php";
            var params = {};
            if ($scope.dt) {
                params.session_date = moment($scope.dt).format('YYYY-MM-DD');
                params.section_id = $scope.currentSection.section_id;
                $http({method: 'POST',
                    url: UserService.appDir + 'php/' + php_script + uniqueSuffix,
                    data: params,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }).
                    success(function(data) {
                        if (parseInt(data.session_id) > 0) {
                            params.session_id = data.session_id;
                            params.sessionDate = $scope.dt;
                            params.section = $scope.currentSection.section;
                            params.module_id = 0;
                            params.open_time = new Date($scope.dt.getFullYear(), $scope.dt.getMonth(), $scope.dt.getDate(), 8, 0);
                            params.close_time = new Date($scope.dt.getFullYear(), $scope.dt.getMonth(), $scope.dt.getDate(), 8, 0);
                            $scope.course.sessions.push(params);
                            $scope.course.sessions = _.sortBy($scope.course.sessions, 'sessionDate');
                        }
                    }).
                    error(function(data, status) {
                        alert( "Error: " + status + " Add session failed. Check your internet connection");
                    });
            }

        };

        $scope.editSessionDate = function(session) {
            $scope.editSession(session);
        };
        $scope.editSessionUnit = function(session) {
            $scope.editSession(session);
        };
        $scope.editSessionOpen = function(session) {
            $scope.editSession(session);
        };
        $scope.editSessionClose = function(session) {
            $scope.editSession(session);
        };

        $scope.editSession = function(s) {
            if (s && s.session_id) {
                var uniqueSuffix = "?" + new Date().getTime();
                var php_script;
                php_script = "editSession.php";
                var params = {};
                params.session_id = s.session_id;
                params.module_id = s.module_id;
                params.session_date = moment(s.sessionDate).format('YYYY-MM-DD');
                s.open_time = mergeDateTime(s.sessionDate, s.open_time);
                params.open_time = moment(localDateToUTC(s.open_time)).format('YYYY-MM-DD HH:mm:ss');
                s.close_time = mergeDateTime(s.sessionDate, s.close_time);
                params.close_time = moment(localDateToUTC(s.close_time)).format('YYYY-MM-DD HH:mm:ss');
                $http({method: 'POST',
                    url: UserService.appDir + 'php/' + php_script + uniqueSuffix,
                    data: params,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }).
                    success(function() {
                    }).
                    error(function(data, status) {
                        alert( "Error: " + status + " Edit session date failed. Check your internet connection");
                    });
            } else {
                alert("No session selected for editing");
            }

        };

        $scope.deleteSession = function(s) {
            var uniqueSuffix = "?" + new Date().getTime();
            var php_script;
            php_script = "deleteSession.php";
            var params = {};
            params.session_id = s.session_id;
            $http({method: 'POST',
                url: UserService.appDir + 'php/' + php_script + uniqueSuffix,
                data: params,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).
                success(function() {
                    for (var i = 0; i < $scope.course.sessions.length; i++) {
                        console.log($scope.course.sessions[i].session_id, s.session_id);
                        if ($scope.course.sessions[i].session_id === s.session_id) {
                            $scope.course.sessions.splice(i,1);
                            break;
                        }
                    }
                }).
                error(function(data, status) {
                    alert( "Error: " + status + " Delete session failed. Check your internet connection");
                });
        };

        $scope.changeSettings = function() {
            var uniqueSuffix = "?" + new Date().getTime();
            var php_script;
            php_script = "updateSettings.php";
            var params = {};
            params.settings = JSON.stringify($scope.course.settings);
            $http({method: 'POST',
                url: UserService.appDir + 'php/' + php_script + uniqueSuffix,
                data: params,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).
                success(function() {
                }).
                error(function(data, status) {
                    alert( "Error: " + status + " Update icon display settings failed. Check your internet connection");
                });
        };


        $scope.changeStudentView = function() {
            var uniqueSuffix = "?" + new Date().getTime();
            var php_script;
            php_script = "editStudentView.php";
            var params = {};
            params.show_attendance = $scope.course.show_attendance?1:0;
            params.show_cold_calls = $scope.course.show_cold_calls?1:0;
            params.show_participation = $scope.course.show_participation?1:0;
            params.show_seating = $scope.course.show_seating?1:0;
            params.enable_seating = $scope.course.enable_seating?1:0;
            params.show_quiz = $scope.course.show_quiz?1:0;
            $http({method: 'POST',
                url: UserService.appDir + 'php/' + php_script + uniqueSuffix,
                data: params,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).
                success(function() {
                }).
                error(function(data, status) {
                    alert( "Error: " + status + " Edit student view failed. Check your internet connection");
                });
        };

        $scope.changeSectionRoom = function(s) {
            var uniqueSuffix = "?" + new Date().getTime();
            var php_script;
            php_script = "changeSectionRoom.php";
            var params = {};
            params.section_id = s.section_id;
            params.room_id = s.room_id;
            $http({method: 'POST',
                url: UserService.appDir + 'php/' + php_script + uniqueSuffix,
                data: params,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).
                success(function() {
                }).
                error(function(data, status) {
                    alert( "Error: " + status + " Change section room failed. Check your internet connection");
                });
        };



  });
