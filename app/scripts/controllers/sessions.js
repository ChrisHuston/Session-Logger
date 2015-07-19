'use strict';

angular.module('sessionLoggerApp')
  .controller('SessionsCtrl', function ($scope, UserService, $http, $location, $window, uiGridConstants) {

        if (UserService.course.sections.length > 0) {
            $scope.currentSection = UserService.admin.sections[0];
        } else {
            $scope.currentSection = null;
        }

        $scope.course = UserService.course;
        $scope.admin = UserService.admin;
        $scope.session_data = [];
        $scope.showGrid = false;

        var sessions = UserService.course.sessions;

        $scope.dataTypes = [
            {field:'present_', label:'Present'},
            {field:'excused_', label:'Excused'},
            {field:'unexcused_', label:'Unexcused'},
            {field:'late_', label:'Late'},
            {field:'cold_call_', label:'Cold Call'},
            {field:'comments_', label:'# Comments'},
            {field:'participation_', label:'Participation'},
            {field:'notes_', label:'Notes'}
        ];

        $scope.dataType = $scope.dataTypes[0];

        $scope.colDefs = [{field:'net_id', pinnedLeft: true, width:'70', visible:false, displayName:'NetID', type:'string'},
            {field:'section', pinnedLeft: true, width:'60', visible:true, displayName:'Sect', type:'number', cellClass:'text-center'},
            {field: 'user_name', pinnedLeft: true , width:'150', displayName: 'Name', type:'string'}];


        $scope.summaryGridOptions = {
            showGridFooter: true,
            showColumnFooter: true,
            enableFiltering: true,
            enableSorting: true,
            enableRowSelection: false,
            enableGroupHeaderSelection: true,
            multiSelect: false,
            enableGridMenu: true,
            enableCellEditOnFocus: false,
            columnDefs: $scope.colDefs
        };


        $scope.summaryGridOptions.onRegisterApi = function(gridApi){
            $scope.summaryGridApi = gridApi;
        };

        var getAllSessionData = function() {
            $scope.all_sessions = [];
            var uniqueSuffix = "?" + new Date().getTime();
            var params = {};
            $http({method: 'POST',
                url: UserService.appDir + 'php/getAllSessionData.php' + uniqueSuffix,
                data: params,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).
                success(function(data) {
                    var currentStudent = {net_id:null};
                    angular.forEach(data.session_data, function(d) {
                        if (currentStudent.net_id !== d.net_id) {
                            if (currentStudent.net_id !== null) {
                                $scope.all_sessions.push(angular.copy(currentStudent));
                            }
                            currentStudent = {net_id: d.net_id, user_name: d.user_name, section: parseInt(d.section), section_id: parseInt(d.section_id),
                                present_total:0, excused_total:0, unexcused_total:0, cold_call_total:0, participation_total:0, late_total:0, comments_total:0};
                        }
                        var display_date = d.session_date.substr(5);
                        currentStudent['present_' + display_date] = d.present;
                        currentStudent['excused_' + display_date] = d.excused;
                        currentStudent['unexcused_' + display_date] = d.unexcused;
                        currentStudent['late_' + display_date] = d.late;
                        currentStudent['cold_call_' + display_date] = d.cold_call;
                        currentStudent['participation_' + display_date] = d.participation;
                        currentStudent['comments_' + display_date] = d.comments;
                        currentStudent['notes_' + display_date] = d.notes;
                        currentStudent.present_total += parseInt(d.present);
                        currentStudent.excused_total += parseInt(d.excused);
                        currentStudent.unexcused_total += parseInt(d.unexcused);
                        currentStudent.cold_call_total += parseInt(d.cold_call);
                        currentStudent.participation_total += parseFloat(d.participation);
                        currentStudent.late_total += parseInt(d.late);
                        currentStudent.comments_total += parseInt(d.comments);
                    });
                    if (currentStudent.net_id !== null) {
                        $scope.all_sessions.push(angular.copy(currentStudent));
                    }
                    $scope.summaryGridOptions.data = $scope.all_sessions;
                    $scope.changeSection();
                }).
                error(function(data, status) {
                    alert("Error: " + status + " Get session data failed. Check your internet connection");
                });
        };

        getAllSessionData();

        $scope.changeSection = function() {
            $scope.summaryGridOptions.data = _.filter($scope.all_sessions, function(obj) {
                if (!obj.section_id) return false;
                if ($scope.currentSection.section_id === 0) return true;
                return obj.section_id === $scope.currentSection.section_id;
            });

            $scope.initGrid();
        };

        $scope.initGrid = function() {
            /*
            $scope.colDefs = [{field:'net_id', pinnedLeft: true, width:'70', visible:false, displayName:'NetID', type:'string'},
                {field:'section', pinnedLeft: true, width:'60', visible:true, displayName:'Sect', type:'number', cellClass:'text-center'},
                {field: 'user_name', pinnedLeft: true , width:'150', displayName: 'Name', type:'string'}];
                */
            while ($scope.colDefs.length > 3) {
                $scope.colDefs.splice($scope.colDefs.length-1, 1);
            }
            if ($scope.dataType.field !== 'notes_') {
                $scope.colDefs.push({field:$scope.dataType.field + 'total', pinnedLeft: true,
                    width:'70', displayName:'Total', cellClass:'text-right',
                    headerClass:'text-center', type:'number', filters:[
                        {
                            condition: uiGridConstants.filter.GREATER_THAN,
                            placeholder: '>'
                        },
                        {
                            condition: uiGridConstants.filter.LESS_THAN,
                            placeholder: '<'
                        }
                    ], aggregationType: uiGridConstants.aggregationTypes.sum, aggregationHideLabel:true});
            }
            var col;
            if ($scope.currentSection.section_id === 0) {
                var data_sessions = _.uniq(sessions, function(session) {
                    return session.session_date;
                });
            } else {
               data_sessions =  _.filter(sessions, {section_id:$scope.currentSection.section_id});
            }
            angular.forEach(data_sessions, function(s) {
                if (s.session_date) {
                    var display_date = s.session_date.substr(5);
                    if ($scope.dataType.field === 'present_') {
                        col = {field:$scope.dataType.field + display_date, width:'90', displayName: display_date, cellClass:'text-center', type:'number', cellTemplate:'<div class="ui-grid-cell-contents" title="TOOLTIP" ng-class="{islate:row.entity[\'late_'+ s.session_id + '\']===\'1\', isexcused:row.entity[\'excused_'+ s.session_id + '\']===\'1\', isunexcused:row.entity[\'unexcused_'+ s.session_id + '\']===\'1\'}">{{COL_FIELD CUSTOM_FILTERS}}</div>}"'};
                    } else {
                        col = {field:$scope.dataType.field + display_date, width:'90', displayName: display_date, cellClass:'text-center', type:'number'};
                    }
                    if ($scope.dataType.field !== 'notes_') {
                        col.width = 90;
                        col.aggregationHideLabel = true;
                        col.aggregationType= uiGridConstants.aggregationTypes.sum;
                        col.filters = [
                            {
                                condition: uiGridConstants.filter.GREATER_THAN,
                                placeholder: '>'
                            },
                            {
                                condition: uiGridConstants.filter.LESS_THAN,
                                placeholder: '<'
                            }
                        ]
                    } else {
                        col.width = 250;
                    }
                    col.pinnable = false;
                    $scope.colDefs.push (angular.copy(col));
                } else {
                    console.log(s);
                }
            });
        };

        $scope.exportGrid = function() {
            var keys = [];
            var headings = [];
            for (var f in $scope.colDefs) {
                if ($scope.colDefs.hasOwnProperty(f)){
                    keys.push($scope.colDefs[f].field);
                    headings.push($scope.colDefs[f].displayName);
                }
            }
            var csv_data = '';

            function csvStringify(str) {
                if (str == null) { // we want to catch anything null-ish, hence just == not ===
                    return '';
                }
                if (typeof(str) === 'number') {
                    return '' + str;
                }
                if (typeof(str) === 'boolean') {
                    return (str ? 'TRUE' : 'FALSE') ;
                }
                if (typeof(str) === 'string') {
                    return str.replace(/"/g,'""');
                }

                return JSON.stringify(str).replace(/"/g,'""');
            }
            function swapLastCommaForNewline(str) {
                var newStr = str.substr(0,str.length - 1);
                return newStr + "\n";
            }
            for (var k in headings) {
                csv_data += '"' + headings[k] + '",';
            }
            csv_data = swapLastCommaForNewline(csv_data);
            var gridData = $scope.session_data;
            for (var gridRow in gridData) {
                //console.log(gridRow);
                for ( k in keys) {
                    var curCellRaw = gridData[gridRow][keys[k]];
                    csv_data += '"' + csvStringify(curCellRaw) + '",';
                }
                csv_data = swapLastCommaForNewline(csv_data);
            }
            var download_name = $scope.course.course_name + '-' + $scope.dataType.label + '-' + $scope.currentSection.section;
            var uniqueSuffix = "?" + new Date().getTime();
            var params = {};
            params.download_name = download_name;
            params.csv_data = csv_data;
            var db_call = $http({method: 'POST',
                url: UserService.appDir + 'php/exportSessionData.php' + uniqueSuffix,
                data: params,
                responseType:'document',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
            db_call.success(function(data) {
                if (data) {
                    $window.open(UserService.appDir + 'php/getSessionExport.php' + uniqueSuffix, '_blank');
                } else {
                    alert("Export failed. Check your internet connection.");
                }

            }).
                error(function(data, status) {
                    alert("Error: " + status + " Export failed. Check your internet connection");
                });
        };

        $scope.previewStudent = function(s, evt) {
            if (evt.shiftKey) {
                $window.open(UserService.appDir + "index.php?id=" + $scope.course.course_id + "&net_id=" + s.net_id + "&access_code=" + $scope.course.access_code);
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
                                if (obj.unexcused === '1') {
                                    UserService.user.has_unexcused = true;
                                }
                            });
                        }
                        $location.path('/');
                    }).
                    error(function(data, status) {
                        alert("Error: " + status + " Add new user failed. Check your internet connection");
                    });
            }

        };

  });
