'use strict';

// Declare app level module which depends on views, and core components
angular.module('myApp', [
  'ngRoute',
  'ui.bootstrap',
  'myApp.searchBank',
  'myApp.viewBank',
  // 'myApp.version'
]).
config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');

    $routeProvider.otherwise({
      redirectTo: '/search'
    });
  }])
  .filter('regularCase', function () {
    return function (text) {
      return text.split('_').join(' ')[0].toUpperCase() + text.split('_').join(' ').substr(1, text.split('_').join(' ').length)
    }
  });