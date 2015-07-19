'use strict';

angular.module('sessionLoggerApp', ['ngSanitize','ngRoute', 'ngTouch', 'ui.bootstrap',
  'ui.grid', 'ui.grid.pinning', 'ui.grid.grouping', 'ui.grid.selection',
  'ui.grid.autoResize','ui.grid.exporter', 'ui.grid.edit'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/log', {
        templateUrl: 'views/log.html',
        controller: 'LogCtrl'
      })
      .when('/sessions', {
        templateUrl: 'views/sessions.html',
        controller: 'SessionsCtrl'
      })
      .when('/grid', {
        templateUrl: 'views/grid.html',
        controller: 'GridCtrl'
      })
      .when('/admin', {
        templateUrl: 'views/admin.html',
        controller: 'AdminCtrl'
      })
      .when('/users', {
        templateUrl: 'views/users.html',
        controller: 'UsersCtrl'
      })
      .when('/respond', {
        templateUrl: 'views/respond.html',
        controller: 'RespondCtrl'
      })
      .when('/radmin', {
        templateUrl: 'views/radmin.html',
        controller: 'RadminCtrl'
      })
      .when('/seating', {
        templateUrl: 'views/seating.html',
        controller: 'SeatingCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
