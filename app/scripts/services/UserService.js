'use strict';

function get_ua() {
    var ua = navigator.userAgent;
    var loc = ua.search('Mozilla/5.0 ');
    if (loc !== -1) {
        ua = ua.replace('Mozilla/5.0 ', '');
    }
    loc = ua.search('AppleWebKit/');
    if (loc !== -1) {
        ua = ua.replace('AppleWebKit/','');
    }
    loc = ua.search(/\(KHTML, like Gecko\) /);
    if (loc !== -1) {
        ua = ua.replace('(KHTML, like Gecko) ','');
    }
    loc = ua.search(/\(/);
    if (loc !== -1) {
        ua = ua.replace('(','');
    }
    return ua;
}

angular.module('sessionLoggerApp')
    .factory('UserService', ['$http', '$location', '$timeout', function ($http, $location, $timeout) {
        var userInstance = {};

        userInstance.app_dir = "/app/sessions/";

        userInstance.initApp = function() {
            userInstance.user = {net_id:0, priv_level:0, user_name:"", has_late:false, has_excused:false, has_unexcused:false,
                loginError:null, section:{section_id:null, room_id:null}, showLast:true, showNicknames:true, useAlphabetic:false};
            userInstance.student = {student_name:'', section:1};
            userInstance.route = {is_session_data:true, is_log:false, is_sessions:false, is_grid:false, is_quiz:false, is_seating_chart:false, module_type:'Quiz'};
            userInstance.course = {course_id:0, k_course_id:0, access_code:0, course_name:"", show_columns:0, show_attendance:false,
                show_cold_calls:false, show_participation:false, show_seating:false, enable_seating:false,
                sessions:[], students:[], session_data:[], sections:[], settings:null, quizzes:[]};
            userInstance.course.settings = {show_present:true, show_late:true, show_excused:true, show_unexcused:true, show_counter:true,
                show_flag:true, show_notes:true, show_coldcall:true, show_participation:true};
            userInstance.ua = get_ua();
            userInstance.version = "0.2.0";
            userInstance.admin = {sections:[]};
        };

        userInstance.initApp();

        userInstance.classrooms = [
            {name:'GM', room_id:'1', rows:[
                {seats:18, gaps:[{seat:5, gap:140}, {seat:13, gap:140}]},
                {seats:19, gaps:[{seat:6, gap:105}, {seat:13, gap:135}]},
                {seats:16, gaps:[{seat:0, gap:70},{seat:5, gap:140}, {seat:11, gap:170}]},
                {seats:13, gaps:[{seat:0, gap:140},{seat:4, gap:175}, {seat:9, gap:205}]},
                {seats:10, gaps:[{seat:0, gap:210},{seat:3, gap:210}, {seat:7, gap:240}]}
            ]},
            {name:'Rosenwald', room_id:'2', rows:[
                {seats:20, gaps:[{seat:6, gap:70}, {seat:14, gap:70}]},
                {seats:17, gaps:[{seat:0, gap:70}, {seat:5, gap:105}, {seat:12, gap:105}]},
                {seats:16, gaps:[{seat:0, gap:70},{seat:5, gap:140}, {seat:11, gap:140}]},
                {seats:13, gaps:[{seat:0, gap:140},{seat:4, gap:175}, {seat:9, gap:170}]},
                {seats:10, gaps:[{seat:0, gap:210},{seat:3, gap:210}, {seat:7, gap:205}]}
            ]},
            {name:'Borelli', room_id:'3', rows:[
                {seats:16, gaps:[{seat:8, gap:70}]},
                {seats:16, gaps:[{seat:8, gap:70}]},
                {seats:16, gaps:[{seat:8, gap:70}]},
                {seats:12, gaps:[{seat:0, gap:140}, {seat:6, gap:70}]},
                {seats:8, gaps:[{seat:0, gap:280}, {seat:4, gap:70}]}
            ]},
            {name:'Barclay', room_id:'9', rows:[
                {seats:17, gaps:[{seat:0, gap:105}]},
                {seats:20, gaps:[]},
                {seats:21, gaps:[{seat:0, gap:0}]},
                {seats:18, gaps:[{seat:0, gap:70}]}
            ]},
            {name:'Ankeny', room_id:'10', rows:[
                {seats:17, gaps:[{seat:0, gap:140}]},
                {seats:20, gaps:[{seat:0, gap:70}]},
                {seats:21, gaps:[]},
                {seats:18, gaps:[{seat:0, gap:105}]}
            ]},
            {name:'Stoneman', room_id:'14', rows:[
                {seats:11, gaps:[{seat:0, gap:210}, {seat:1, gap:35}, {seat:10, gap:35}]},
                {seats:17, gaps:[{seat:1, gap:35}, {seat:16, gap:35}]},
                {seats:17, gaps:[{seat:1, gap:35}, {seat:16, gap:35}]},
                {seats:16, gaps:[{seat:1, gap:35}]},
                {seats:13, gaps:[{seat:0, gap:210}, {seat:12, gap:35}]}
            ]},
            {name:'Stoneman-GEM', room_id:'15', rows:[
                {seats:9, gaps:[{seat:0, gap:210}, {seat:8, gap:35}]},
                {seats:16, gaps:[]},
                {seats:16, gaps:[]},
                {seats:16, gaps:[]},
                {seats:13, gaps:[{seat:0, gap:105}]}
            ]},
            {name:'Georgiopoulos', room_id:'16', rows:[
                {seats:26, gaps:[{seat:9, gap:35}, {seat:17, gap:35}]},
                {seats:26, gaps:[{seat:9, gap:35}, {seat:17, gap:35}]},
                {seats:22, gaps:[{seat:0, gap:140}, {seat:7, gap:35}, {seat:15, gap:35}]},
                {seats:18, gaps:[{seat:0, gap:227}, {seat:9, gap:175}]},
                {seats:16, gaps:[{seat:0, gap:297}, {seat:8, gap:175}]},
                {seats:14, gaps:[{seat:0, gap:367}, {seat:7, gap:175}]},
                {seats:10, gaps:[{seat:0, gap:507}, {seat:5, gap:175}]},
                {seats:4, gaps:[{seat:0, gap:577}, {seat:1, gap:70}, {seat:2, gap:315}, {seat:3, gap:70}]}
            ]},
            {name:'Alperin', room_id:'11', rows:[
                {seats:7, gaps:[]},
                {seats:2, gaps:[{seat:1, gap:420}]},
                {seats:2, gaps:[{seat:1, gap:420}]},
                {seats:2, gaps:[{seat:1, gap:420}]},
                {seats:2, gaps:[{seat:1, gap:420}]},
                {seats:2, gaps:[{seat:1, gap:420}]},
                {seats:2, gaps:[{seat:1, gap:420}]},
                {seats:2, gaps:[{seat:1, gap:420}]},
                {seats:2, gaps:[{seat:1, gap:420}]},
                {seats:7, gaps:[]}
            ]},
            {name:'Alperin U', room_id:'13', rows:[
                {seats:10, gaps:[{seat:0, gap:70}]},
                {seats:2, gaps:[{seat:1, gap:700}]},
                {seats:2, gaps:[{seat:1, gap:700}]},
                {seats:2, gaps:[{seat:1, gap:700}]},
                {seats:2, gaps:[{seat:1, gap:700}]},
                {seats:2, gaps:[{seat:1, gap:700}]},
                {seats:2, gaps:[{seat:1, gap:700}]},
                {seats:2, gaps:[{seat:1, gap:700}]},
                {seats:2, gaps:[{seat:1, gap:700}]},
                {seats:2, gaps:[{seat:1, gap:700}]},
                {seats:2, gaps:[{seat:1, gap:700}]}
            ]},
            {name:'Shapiro', room_id:'12', rows:[
                {seats:9, gaps:[{seat:0, gap:315}]},
                {seats:10, gaps:[{seat:0, gap:280}]},
                {seats:9, gaps:[{seat:0, gap:315}]},
                {seats:12, gaps:[{seat:2, gap:210}, {seat:10, gap:210}]},
                {seats:14, gaps:[{seat:4, gap:140}, {seat:10, gap:140}]},
                {seats:15, gaps:[{seat:5, gap:70}, {seat:11, gap:140}]},
                {seats:7, gaps:[{seat:0, gap:70}, {seat:3, gap:210}]}
            ]},
            {name:'1x12', room_id:'17', rows:[
                {seats:12, gaps:[]}
            ]},
            {name:'2x15', room_id:'7', rows:[
                {seats:15, gaps:[]},
                {seats:15, gaps:[]}
            ]},
            {name:'3x15', room_id:'4', rows:[
                {seats:15, gaps:[]},
                {seats:15, gaps:[]},
                {seats:15, gaps:[]}
            ]},
            {name:'4x15', room_id:'5', rows:[
                {seats:15, gaps:[]},
                {seats:15, gaps:[]},
                {seats:15, gaps:[]},
                {seats:15, gaps:[]}
            ]},
            {name:'5x15', room_id:'6', rows:[
                {seats:15, gaps:[]},
                {seats:15, gaps:[]},
                {seats:15, gaps:[]},
                {seats:15, gaps:[]},
                {seats:15, gaps:[]}
            ]},
            {name:'Carson LO2', room_id:'8', rows:[
                {seats:14, gaps:[{seat:0, gap:70}]},
                {seats:14, gaps:[{seat:0, gap:70}]},
                {seats:15, gaps:[{seat:0, gap:70}]},
                {seats:16, gaps:[]},
                {seats:14, gaps:[{seat:0, gap:70}]}
            ]}

        ];


        userInstance.makeClassroom = function(section) {
            var seat_width = 72;
            var room_id = section.room_id;
            for (var classroomIndex=0; classroomIndex < userInstance.classrooms.length; classroomIndex++) {
                if (room_id === userInstance.classrooms[classroomIndex].room_id) {
                    break;
                }
            }
            userInstance.course.grid = [];
            var row_num = 0;
            var max_width = 0;
            if (userInstance.classrooms[classroomIndex]) {
                angular.forEach(userInstance.classrooms[classroomIndex].rows, function(row) {
                    var seating_row = [];
                    for (var i=0; i < row.seats; i++) {
                        var gridObj = {};
                        gridObj.row = row_num;
                        gridObj.column = i;
                        gridObj.margin = 0;
                        gridObj.student = null;
                        seating_row.push(gridObj);
                    }
                    var row_width = (row.seats * seat_width) + 5;
                    angular.forEach(row.gaps, function(g) {
                        seating_row[g.seat].margin = g.gap;
                        row_width += g.gap;
                    });
                    userInstance.course.grid.push(seating_row);
                    row_num += 1;
                    max_width = Math.max(row_width, max_width);
                });
                $timeout(function() {
                    $(".class-row").width(max_width);
                }, 400);
            }
        };

        userInstance.initStudentSeat = function(s) {
            s.section_id = parseInt(s.section_id);
            s.seat_row = parseInt(s.seat_row);
            s.seat_col = parseInt(s.seat_col);
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
            s.user_img = parseInt(s.user_img);
            if (s.user_img === 1) {
                s.photo = s.canvas_img;
            } else {
                var prefix = s.net_id.substring(0,1);
                if (prefix == "f") {
                    s.photo = "http://yourUrl/pictures/F00/" + s.net_id.toUpperCase() + ".gif";
                } else if (prefix == "d") {
                    prefix = s.net_id.substring(1,3).toUpperCase();
                    var subId = s.net_id.substring(1,7);
                    s.photo = "http://yourUrl/" + prefix + "/" + subId.toUpperCase() + ".gif";
                }
            }
        };


        userInstance.login = function() {
            var uniqueSuffix = "?" + new Date().getTime();
            var php_script;
            var params = {};
            if (location.pathname.indexOf("secure") != -1) {
                php_script = "saml_login.php";
            } else if ($location.absUrl().indexOf("access_code") != -1) {
                php_script = 'preview_login.php';
            } else if (location.pathname.indexOf("sessions") != -1) {
                php_script = "lti_login.php";
            }

            params.os = userInstance.ua;
            params.version = userInstance.version;

            $http({method: 'POST',
                url: userInstance.appDir + 'php/' + php_script + uniqueSuffix,
                data: params,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).
                success(function(data) {
                    if (data.login_error === "NONE") {
                        userInstance.user.net_id = data.net_id;
                        userInstance.user.user_name = data.user_name;
                        userInstance.user.priv_level = parseInt(data.priv_level);
                        userInstance.course.course_id = data.course_id;
                        userInstance.course.course_name = data.course_name;

                        angular.forEach(data.sections, function(s) {
                            s.section_id = parseInt(s.section_id);
                            s.section = parseInt(s.section);
                            s.section_name = "Section " + s.section;
                        });
                        if (data.sections) {
                            userInstance.course.sections = data.sections;
                            userInstance.admin.sections = angular.copy(data.sections);
                            userInstance.admin.sections.unshift({section_id:0, section_name:'ALL', section:'ALL'});
                        }


                        userInstance.course.students = data.students;
                        angular.forEach(data.sessions, function(s) {
                            s.section_id = parseInt(s.section_id);
                            s.sessionDate = moment(s.session_date)._d;
                            s.module_id = parseInt(s.module_id);
                            s.open_time = utcStrToLocalDate(s.open_time);
                            s.close_time = utcStrToLocalDate(s.close_time);
                        });
                        userInstance.course.sessions = data.sessions;
                        userInstance.course.show_columns = parseInt(data.show_attendance) + parseInt(data.show_cold_calls) + parseInt(data.show_participation);
                        userInstance.course.show_attendance = parseInt(data.show_attendance) === 1;
                        userInstance.course.show_cold_calls = parseInt(data.show_cold_calls) === 1;
                        userInstance.course.show_participation = parseInt(data.show_participation) === 1;
                        userInstance.course.show_data = data.session_data != null;
                        userInstance.course.show_seating = parseInt(data.show_seating) === 1;
                        userInstance.course.enable_seating = parseInt(data.enable_seating) === 1;
                        userInstance.course.show_quiz = parseInt(data.show_quiz) === 1;
                        userInstance.course.k_course_id = data.k_course_id;
                        if (data.settings) {
                            userInstance.course.settings = JSON.parse(data.settings);
                        }

                        localStorage["canvas.sessions.user_id"] = data.net_id;
                        userInstance.user.loginError = null;
                        if (userInstance.user.priv_level > 1 && userInstance.course.sections.length != 0) {
                            angular.forEach(userInstance.course.sessions, function(s) {
                                if (s.module_id !== 0) {
                                    userInstance.course.quizzes.push(s);
                                }
                            });
                            userInstance.makeClassroom(userInstance.course.sections[0]);
                            userInstance.course.access_code = data.access_code;
                            userInstance.route.is_log = true;
                            userInstance.route.is_session_data = false;
                            angular.forEach(userInstance.course.students, function(s) {
                                userInstance.initStudentSeat(s);
                            });
                            if ($location.path() === '/') {
                                if (data.module_id) {
                                    $location.path('/respond/' + data.module_id +'/' + data.section);
                                } else {
                                    $location.path('/log');
                                }
                            }

                        } else {
                            var names = data.user_name.split(",");
                            if (names.length > 1) {
                                userInstance.student.student_name = names[1] + ' ' + names[0];
                            } else {
                                userInstance.student.student_name = data.user_name;
                            }
                            userInstance.user.section.section_id = data.section_id;
                            userInstance.user.section.room_id = data.room_id;
                            userInstance.student.section = data.section;
                            userInstance.course.session_data = data.session_data;
                            if (userInstance.course.show_attendance) {
                                angular.forEach(data.session_data, function(obj) {
                                    if (obj.late === '1') {
                                        userInstance.user.has_late = true;
                                    }
                                    if (obj.excused === '1') {
                                        userInstance.user.has_excused = true;
                                    }
                                    if (obj.unexcused === '1') {
                                        userInstance.user.has_unexcused = true;
                                    }
                                });
                            }
                            if (data.session_data) {
                                userInstance.route.is_session_data = true;
                                $location.path('/');
                            } else if (userInstance.course.show_seating) {
                                userInstance.route.is_seating_chart = true;
                                $location.path('/seating');
                            }
                        }
                    } else {
                        userInstance.user.loginError =  data.login_error;
                        $location.path('/');
                    }
                }).
                error(function(data, status) {
                    userInstance.user.loginError =  "Error: " + status + " Sign-in failed. Check your internet connection";
                    $location.path('/');
                });
        };

        userInstance.updateSection = function(net_id, course_id, section_id) {
            var uniqueSuffix = "?" + new Date().getTime();
            var params = {};
            params.net_id = net_id;
            params.course_id = course_id;
            params.section_id = section_id;
            var db_call = $http({method: 'POST',
                url: userInstance.appDir + 'php/updateSection.php' + uniqueSuffix,
                data: params,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
            db_call.success(function() {
            }).
                error(function(data, status) {
                    alert("Error: " + status + " Update section failed. Check your internet connection");
                });
            return db_call;
        };

        userInstance.getStudentSection = function(section_id) {
            var uniqueSuffix = "?" + new Date().getTime();
            var params = {};
            params.section_id = section_id;
            var db_call = $http({method: 'POST',
                url: userInstance.appDir + 'php/getStudentSection.php' + uniqueSuffix,
                data: params,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
            db_call.error(function(data, status) {
                    alert("Error: " + status + " Get student section failed. Check your internet connection");
                });
            return db_call;
        };


        return userInstance;
    }]);

function utcStrToLocalDate(dtstr) {
    if (dtstr) {
        var utcDate;
        if (angular.isDate(dtstr)) {
            utcDate  = dtstr;
        } else {
            var year = dtstr.substr(0,4);
            var month = (dtstr.substr(5,2)-1);
            var day = dtstr.substr(8,2);
            utcDate = new Date(year, month, day, dtstr.substr(11,2), dtstr.substr(14,2), dtstr.substr(17,2)).getTime();
        }
        var offset = new Date().getTimezoneOffset() * 60 * 1000;
        return new Date(utcDate - offset);
    } else {
        return null;
    }
}

function localDateToUTC(d) {
    var offset = new Date().getTimezoneOffset() * 60 * 1000;
    return new Date(d.getTime() + offset);
}

function mergeDateTime(d,t) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate(), t.getHours(), t.getMinutes());
}