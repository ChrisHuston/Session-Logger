'use strict';

angular.module('sessionLoggerApp')
  .controller('LogCtrl', function ($scope, UserService, $http, $modal) {
        if (UserService.course.sections.length > 0) {
            $scope.currentSection = UserService.course.sections[0];
        } else {
            $scope.currentSection = null;
        }
        $scope.course = UserService.course;
        $scope.user = UserService.user;
        $scope.selectedSession = null;

        $scope.changeSection = function() {
            UserService.makeClassroom($scope.currentSection);
            angular.forEach($scope.course.grid, function(r) {
                angular.forEach(r, function(c) {
                    c.student = null;
                });
            });
            $scope.selectedSession = null;
        };

        if (UserService.course.sections && UserService.course.sections.length > 0) {
            $scope.changeSection();
        }


        $scope.addSession = function() {
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

        $scope.toggleAlphabetic = function() {
            angular.forEach($scope.course.grid, function(r) {
                angular.forEach(r, function(s) {
                    s.student = null;
                })
            });
            if ($scope.selectedSession) {
                $scope.getSessionData($scope.selectedSession);
            }
            var uniqueSuffix = "?" + new Date().getTime();
            var php_script;
            php_script = "toggleSectionAlphabetic.php";
            var params = {};
            params.course_id = UserService.course.course_id;
            params.section_id = $scope.currentSection.section_id;
            params.alphabetic = $scope.currentSection.alphabetic;

            $http({method: 'POST',
                url: UserService.appDir + 'php/' + php_script + uniqueSuffix,
                data: params,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).
                success(function(data) {
                    if (!data) {
                        alert( "Error: Toggle alphabetic failed. Check your internet connection");
                    }
                }).
                error(function(data, status) {
                    alert( "Error: " + status + " Toggle alphabetic failed. Check your internet connection");
                });
        };

        var s_counter = 0;

        $scope.getSessionData = function(session) {
            $scope.selectedSession = session;
            var alphaRow = 0;
            var alphaSeat = 0;
            var uniqueSuffix = "?" + new Date().getTime();
            var php_script;
            php_script = "getSessionData.php";
            var params = {};
            params.session_id = session.session_id;
            params.section_id = session.section_id;
            $http({method: 'POST',
                url: UserService.appDir + 'php/' + php_script + uniqueSuffix,
                data: params,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).
                success(function(data) {
                    angular.forEach(data.session_data, function(s) {
                        s.session_id = session.session_id;
                        s.section_id = parseInt(s.section_id);
                        s.seat_row = parseInt(s.seat_row);
                        s.seat_col = parseInt(s.seat_col);
                        s.participation = parseFloat(s.participation);
                        s.comments = parseInt(s.comments);
                        s.cold_call = s.cold_call === '1';
                        s.present = s.present === '1';
                        s.excused = s.excused === '1';
                        s.unexcused = s.unexcused === '1';
                        s.late = s.late === '1';
                        s.flag = s.flag === '1';
                        var names = s.user_name.split(",");
                        if (names.length > 1) {
                            s.first_name = names[1];
                            s.last_name = names[0];
                        } else {
                            names = s.user_name.split(" ");
                            s.first_name = names[0];
                            s.last_name = names[names.length-1];
                            if (s.last_name === "III" || s.last_name === "II" || s.last_name == "Jr.") {
                                s.last_name = names[names.length-2];
                            }
                        }
                        if (s.nickname === null || s.nickname === '') {
                            s.nickname = s.first_name;
                        }
                        if (s.user_img === '1') {
                            s.photo = s.canvas_img;
                        } else {
                            var prefix = s.net_id.substring(0,1);
                            if (prefix == "f") {
                                s.photo = "http://intranet.tuck.dartmouth.edu/pictures/F00/" + s.net_id.toUpperCase() + ".gif";
                            } else if (prefix == "d") {
                                prefix = s.net_id.substring(1,3).toUpperCase();
                                var subId = s.net_id.substring(1,7);
                                s.photo = "http://intranet.tuck.dartmouth.edu/pictures/" + prefix + "/" + subId.toUpperCase() + ".gif";
                            }
                        }
                        /*
                        if (s_counter === 0) {
                            s.photo = "http://intranet.tuck.dartmouth.edu/pictures/27/27469X.gif";
                            s.first_name = "Chris";
                            s.last_name = "Canvas";
                            s_counter = 1;
                        } else if (s_counter === 1) {
                            s.photo = "http://intranet.tuck.dartmouth.edu/pictures/15/15290F.gif";
                            s.first_name = "Andrew";
                            s.last_name = "Canvas";
                            s_counter = 2;
                        } else {
                            s.photo = "https://www.tuck.dartmouth.edu/images/resized/uploads/content/s_LeBrun_K_2012_480x720_72_RGB-260x317.jpg";
                            s.first_name = "Kate";
                            s.last_name = "Canvas";
                            s_counter = 0;
                        }
                        s.nickname = s.first_name;
                        */

                        if ($scope.currentSection.alphabetic === '1') {
                            if (alphaSeat < $scope.course.grid[alphaRow].length) {
                                $scope.course.grid[alphaRow][alphaSeat].student = s;
                                alphaSeat += 1;
                            } else {
                                if (alphaRow+1 < $scope.course.grid.length) {
                                    alphaRow += 1;
                                    alphaSeat = 0;
                                    $scope.course.grid[alphaRow][alphaSeat].student = s;
                                    alphaSeat += 1;
                                }
                            }
                        } else if (s.seat_row !== -1 && s.section_id === $scope.currentSection.section_id) {
                            if ($scope.course.grid.length > s.seat_row && $scope.course.grid[s.seat_row].length > s.seat_col) {
                                $scope.course.grid[s.seat_row][s.seat_col].student = s;
                            } else {
                                s.seat_col = -1;
                                s.seat_row = -1;
                            }
                        }
                    });
                }).
                error(function(data, status) {
                    alert( "Error: " + status + " Get session failed. Check your internet connection");
                });
        };

        $scope.addSessionData = function(s) {
            if (!s.session_id || parseInt(s.session_id) === 0) {
                alert("No selected session. Select a session or reload the browser.");
                return;
            }
            var uniqueSuffix = "?" + new Date().getTime();
            var php_script;
            php_script = "addSessionData.php";
            var params = {};
            params.session_id = s.session_id;
            params.net_id = s.net_id;
            params.present = s.present?1:0;
            params.excused = s.excused?1:0;
            params.unexcused = s.unexcused?1:0;
            params.cold_call = s.cold_call?1:0;
            params.participation = s.participation;
            params.comments = s.comments;
            params.late = s.late?1:0;
            params.flag = s.flag?1:0;
            $http({method: 'POST',
                url: UserService.appDir + 'php/' + php_script + uniqueSuffix,
                data: params,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).
                success(function(data) {
                    if (!data) {
                        alert("Add session data failed.");
                    }
                    //params.session_id = data.session_id;
                    //$scope.course.sessions.push(params);
                }).
                error(function(data, status) {
                    alert( "Error: " + status + " Add session failed. Check your internet connection");
                });
        };

        $scope.flagStudent = function(s) {
            s.flag = !s.flag;
            $scope.addSessionData(s);
        };

        $scope.toggleLate = function(s) {
            s.late = !s.late;
            $scope.addSessionData(s);
        };

        $scope.toggleExcused = function(s) {
            s.excused = !s.excused;
            $scope.addSessionData(s);
        };

        $scope.toggleUnexcused = function(s) {
            s.unexcused = !s.unexcused;
            $scope.addSessionData(s);
        };

        $scope.decrementComments = function(s) {
            s.comments -= 1;
            $scope.addSessionData(s);
        };

        $scope.addColdCall = function(s) {
            $scope.addSessionData(s);
        };

        $scope.addParticipation = function(s) {
            $scope.addSessionData(s);
        };

        $scope.addPresent = function(s) {
            $scope.addSessionData(s);
        };

        $scope.incrementComments = function(s, evt) {
            if (evt.shiftKey) {
                if (s.comments > 0) {
                    s.comments -= 1;
                }
            } else {
                s.comments += 1;
            }
            $scope.addSessionData(s);
        };

        $scope.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened = true;
        };

        $scope.dateOptions = {
            'show-weeks': false,
            'starting-day': 0
        };

        $scope.format = 'yyyy-MM-dd';

        $scope.showNotesModal = function (student) {
            var modalInstance = $modal.open({
                templateUrl: 'notesModal.html',
                controller: NotesCtrl,
                backdrop: false,
                resolve: {
                    student: function () {
                        return student;
                    }
                }
            });

            modalInstance.result.then(function () {

            });
        };
  });

var NotesCtrl = function ($scope, UserService, $modalInstance, $http, student) {
    $scope.student = student;

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.submitNotes = function() {
        var uniqueSuffix = "?" + new Date().getTime();
        var params = {};
        params.session_id = $scope.student.session_id;
        params.net_id = $scope.student.net_id;
        params.notes = $scope.student.notes;

        $http({method: 'POST',
            url: UserService.appDir + 'php/addSessionNotes.php' + uniqueSuffix,
            data: params,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).
            success(function() {

                $modalInstance.close();
            }).
            error(function(data, status) {
                alert("Error: " + status + " Add notes failed. Check your internet connection");
            });
    };

    $modalInstance.opened.then(function() {

    });

};
