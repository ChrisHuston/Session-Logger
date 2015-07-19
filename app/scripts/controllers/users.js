'use strict';

angular.module('sessionLoggerApp')
  .controller('UsersCtrl', function ($scope, $http, UserService, $location, $window) {
        $scope.course = UserService.course;
        $scope.showGrid = true;
        $scope.currentSection = 1;
        $scope.new_name = "";
        $scope.new_net_id = "";
        $scope.new_is_admin = false;
        $scope.include_observers = false;


        $scope.getStudents = function() {
            var uniqueSuffix = "?" + new Date().getTime();
            var params = {};
            $http({method: 'POST',
                url: UserService.appDir + 'php/getStudents_test.php' + uniqueSuffix,
                data: params,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).
                success(function(data) {
                    var students = data.students;
                    var users = "";
                    var members = "";
                    var ids = "(";
                    var student_index = 1;

                    angular.forEach(students, function(s) {
                        if ($scope.include_observers || s.type==='StudentEnrollment') {
                            s.net_id = s.user.login_id;
                            s.section_id = s.course_section_id;
                            s.user_name = s.user.sortable_name;
                            s.nick_name = "";
                            s.canvas_user_id = s.user_id;
                            for (var i=0; i < $scope.course.sections.length; i++) {
                                if ($scope.course.sections[i].section_id=== s.section_id) {
                                    s.section = $scope.course.sections[i].section;
                                    break;
                                }
                            }

                            var prefix = s.net_id.substring(0,1);
                            if (prefix == "f") {
                                s.photo = "http://intranet.tuck.dartmouth.edu/pictures/F00/" + s.net_id.toUpperCase() + ".gif";
                            } else if (prefix == "d") {
                                prefix = s.net_id.substring(1,3).toUpperCase();
                                var subId = s.net_id.substring(1,7);
                                s.photo = "http://intranet.tuck.dartmouth.edu/pictures/" + prefix + "/" + subId.toUpperCase() + ".gif";
                            }

                            var member = "(" + UserService.course.course_id + ",'" + s.net_id + "'," + s.section_id + ")";
                            var user = "('" + s.net_id + "',\"" + s.user_name + "\"," + s.canvas_user_id + ")";
                            ids += "'" + s.net_id + "'";

                            member += ", ";
                            user += ", ";
                            ids += ", ";
                            members += member;
                            users += user;
                            student_index += 1;
                        }

                    });
                    members = members.slice(0,-2);
                    users = users.slice(0,-2);
                    ids = ids.slice(0,-2);
                    ids += ")";
                    addUsers(users, members, ids);
                    $scope.course.students = students;
                }).
                error(function(data, status) {
                    alert("Error: " + status + " Get students failed. Check your internet connection");
                });
        };

        var addUsers = function(users, members, ids) {
            var uniqueSuffix = "?" + new Date().getTime();
            var php_script;
            php_script = "addUsers.php";
            var params = {};
            params.users = users;
            params.members = members;
            params.ids = ids;
            $http({method: 'POST',
                url: UserService.appDir + 'php/' + php_script + uniqueSuffix,
                data: params,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).
                success(function(data) {
                    //console.log(data);
                }).
                error(function(data, status) {
                    alert( "Error: " + status + " Add users failed. Check your internet connection");
                });
        };


        $scope.toggleUserImg = function(grid, row) {
            var uniqueSuffix = "?" + new Date().getTime();
            var params = {};
            params.net_id = row.entity.net_id;
            params.user_img = row.entity.user_img;
            params.canvas_user_id = row.entity.canvas_user_id;
            $http({method: 'POST',
                url: UserService.appDir + 'php/toggleUserImg.php' + uniqueSuffix,
                data: params,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).
                success(function(data) {
                    var student = row.entity;
                    if (student.user_img === '1') {
                        student.photo = data.profile_photo;
                    } else {
                        var prefix = student.net_id.substring(0,1);
                        if (prefix == "f") {
                            student.photo = "http://intranet.tuck.dartmouth.edu/pictures/F00/" + student.net_id.toUpperCase() + ".gif";
                        } else if (prefix == "d") {
                            prefix = student.net_id.substring(1,3);
                            var subId = student.net_id.substring(1,7);
                            student.photo = "http://intranet.tuck.dartmouth.edu/pictures/" + prefix + "/" + subId.toUpperCase() + ".gif";
                        }
                    }
                }).
                error(function(data, status) {
                    alert("Error: " + status + " Toggle user image failed. Check your internet connection");
                });
        };


        $scope.studentsGridOptions = {
            showGridFooter: true,
            showColumnFooter: false,
            enableFiltering: true,
            enableSorting: true,
            enableRowSelection: false,
            enableGroupHeaderSelection: false,
            multiSelect: false,
            rowHeight:75,
            enableGridMenu: true,
            enableCellEditOnFocus: true,
            columnDefs: [
                {field: 'del', name: 'delete_user', type:'string', width:'60', enableFiltering:false, displayName:"", enableCellEdit: false, cellTemplate: '<div class="ui-grid-cell-contents"><button class="btn btn-danger btn-xs" ng-click="grid.appScope.removeStudent(grid, row)"><i class="fa fa-trash-o"></i></button></div>'},
                {field: 'photo', type:'string', resizable:true, enableCellEdit: false, displayName: '', width:'60', cellTemplate:'<div class="ui-grid-cell-contents" title="TOOLTIP"><img class="img-responsive" ng-src="{{COL_FIELD CUSTOM_FILTERS}}"></div>'},
                {field:'user_name', displayName:'Name', type:'string', enableCellEdit: true},
                {field:'nickname', displayName:'Nickname', type:'string', enableCellEdit: true},
                {field:'net_id', displayName:'NetID', visible:true, type:'string', enableCellEdit: false},
                {field:'section', displayName:'Section', visible:true, type:'number', enableCellEdit: false, width:'100'},
                {field: 'img', type:'string', displayName:'Img', enableFiltering:false, headerClass:'centeredCol', width:"50", cellClass:'centeredCol',
                    cellTemplate:'<div class="ui-grid-cell-contents" title="TOOLTIP"><input ng-change="grid.appScope.toggleUserImg(grid, row)" type="checkbox" ng-model="row.entity.user_img" ng-true-value="1" ng-false-value="0"</div>'}
            ]
        };

        $scope.studentsGridOptions.data = $scope.course.students;


        $scope.studentsGridOptions.onRegisterApi = function(gridApi){
            $scope.studentsGridApi = gridApi;
            gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef, newValue, oldValue){
                if (newValue !== oldValue) {
                    var uniqueSuffix = "?" + new Date().getTime();
                    var params = {};
                    params.net_id = rowEntity.net_id;
                    params.user_name = rowEntity.user_name.trim();
                    params.nickname = rowEntity.nickname.trim();
                    $http({method: 'POST',
                        url: UserService.appDir + 'php/updateUser.php' + uniqueSuffix,
                        data: params,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).
                        success(function() {
                        }).
                        error(function(data, status) {
                            alert("Error: " + status + " Update nickname failed. Check your internet connection");
                        });
                }
                $scope.$apply();
            });
        };




        $scope.removeStudent = function(grid, row) {
            var uniqueSuffix = "?" + new Date().getTime();
            var params = {};
            params.net_id = row.entity.net_id;
            $http({method: 'POST',
                url: UserService.appDir + 'php/removeCourseStudent.php' + uniqueSuffix,
                data: params,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).
                success(function() {
                    for (var i=0; i < $scope.course.students.length; i++) {
                        if ($scope.course.students[i].net_id === student.net_id) {
                            $scope.course.students.splice(i,1);
                            break;
                        }
                    }
                    $scope.all_students.unshift(student);
                }).
                error(function(data, status) {
                    alert("Error: " + status + " Remove from course failed. Check your internet connection");
                });
        };

        $scope.addStudent = function(student) {
            var uniqueSuffix = "?" + new Date().getTime();
            var params = {};
            params.section = $scope.currentSection;
            params.priv_level = 1;
            if ($scope.new_is_admin) {
                params.priv_level = 2;
                params.section = 0;
            }
            params.net_id = student.net_id;
            $http({method: 'POST',
                url: UserService.appDir + 'php/addCourseStudent.php' + uniqueSuffix,
                data: params,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).
                success(function(data) {
                    if (data) {
                        for (var i=0; i < $scope.all_students.length; i++) {
                            if ($scope.all_students[i].net_id === student.net_id) {
                                $scope.all_students.splice(i,1);
                                break;
                            }
                        }
                        if (!$scope.new_is_admin) {
                            var names = student.user_name.split(",");
                            student.first_name = names[1];
                            student.last_name = names[0];
                            student.section = params.section;
                            student.seat_row = -1;
                            student.seat_col = -1;
                            var prefix = student.net_id.substring(0,1);
                            if (prefix == "F") {
                                student.photo = "http://intranet.tuck.dartmouth.edu/pictures/F00/" + student.net_id + ".gif";
                            } else if (prefix == "D") {
                                prefix = student.net_id.substring(1,3);
                                var subId = student.net_id.substring(1,7);
                                student.photo = "http://intranet.tuck.dartmouth.edu/pictures/" + prefix + "/" + subId + ".gif";
                            }
                            $scope.course.students.unshift(student);
                        } else {
                            alert("Add student failed.");
                        }
                    }

                }).
                error(function(data, status) {
                    alert("Error: " + status + " Add to course failed. Check your internet connection");
                });
        };

        $scope.addNewCourseUser = function() {
            if ($scope.new_net_id === '') {
                alert("Enter the NetId for the new course member.");
                return;
            }
            if ($scope.new_name === '') {
                alert("Enter the Last, First name for the new course member.");
                return;
            }
            var uniqueSuffix = "?" + new Date().getTime();
            var params = {};
            params.section = $scope.currentSection;
            params.priv_level = 1;
            if ($scope.new_is_admin) {
                params.priv_level = 2;
                params.section = 0;
            }
            params.net_id = $scope.new_net_id.trim();
            params.user_name = $scope.new_name.trim();
            params.user_email = params.net_id + '@dartmouth.edu';
            $http({method: 'POST',
                url: UserService.appDir + 'php/addNewCourseUser.php' + uniqueSuffix,
                data: params,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).
                success(function() {
                    if (!$scope.new_is_admin) {
                        var names = params.user_name.split(",");
                        params.first_name = names[1];
                        params.last_name = names[0];
                        params.seat_row = -1;
                        params.seat_col = -1;
                        var prefix = params.net_id.substring(0,1);
                        if (prefix == "F") {
                            params.photo = "http://intranet.tuck.dartmouth.edu/pictures/F00/" + params.net_id + ".gif";
                        } else if (prefix == "D") {
                            prefix = params.net_id.substring(1,3);
                            var subId = params.net_id.substring(1,7);
                            params.photo = "http://intranet.tuck.dartmouth.edu/pictures/" + prefix + "/" + subId + ".gif";
                        }
                        $scope.course.students.unshift(params);
                    }
                    $scope.new_net_id = '';
                    $scope.new_name = '';
                    $scope.new_is_admin = false;
                }).
                error(function(data, status) {
                    alert("Error: " + status + " Add new user failed. Check your internet connection");
                });
        };

        $scope.previewStudent = function(s, evt) {
            if (evt.shiftKey) {
                $window.open(UserService.appDir + "index.php?id=" + $scope.course.course_id + "&net_id=" + s.net_id + "&access_code=" + $scope.course.access_code, "_blank");
            } else {
                var uniqueSuffix = "?" + new Date().getTime();
                var params = {};
                params.net_id = s.net_id;
                $http({method: 'POST',
                    url: UserService.appDir + 'php/preview_student.php' + uniqueSuffix,
                    data: params,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }).
                    success(function(data) {
                        $scope.course.session_data = data.session_data;
                        var names = s.user_name.split(",");
                        UserService.student.student_name = names[1] + ' ' + names[0];
                        UserService.student.section = data.section;
                        UserService.course.show_columns = $scope.course.show_attendance?1:0 + $scope.course.show_cold_calls?1:0 + $scope.course.show_participation?1:0;
                        if ($scope.course.show_attendance) {
                            angular.forEach($scope.course.session_data, function(obj) {
                                if (obj.late === '1') {
                                    UserService.user.has_late = true;
                                }
                                if (obj.excused === '1') {
                                    UserService.user.has_excused = true;
                                }
                            });
                        }
                        $location.path('/');
                    }).
                    error(function(data, status) {
                        alert("Error: " + status + " Preview user failed. Check your internet connection");
                    });
            }

        }
    });
