'use strict';

angular.module('sessionLoggerApp')
  .controller('MainCtrl', function ($scope, UserService) {
        $scope.course = UserService.course;
        $scope.student = UserService.student;
        $scope.user = UserService.user;
  });
