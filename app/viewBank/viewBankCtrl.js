'use strict';

angular.module('myApp.viewBank', ['ngRoute'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/bank/:bankId', {
      templateUrl: 'viewBank/viewBank.html',
      controller: 'ViewBankCtrl'
    });
  }])

  .controller('ViewBankCtrl', ["$scope", "$http", "$filter", "$routeParams", function ($scope, $http, $filter, $routeParams) {

    $scope.init = function () {
      $scope.data = {
        bankId: $routeParams.bankId
      }
      if ($scope.data.bankId) {
        try {
          $scope.data.bankData = JSON.parse(window.localStorage.getItem($scope.data.bankId))
        } catch {
          $scope.data.bankData = null
        }
      } else {
        $scope.data.bankData = null
      }
    }

    $scope.init()

  }]);