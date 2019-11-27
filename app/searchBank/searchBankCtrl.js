'use strict';

angular.module('myApp.searchBank', ['ngRoute'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/search', {
      templateUrl: 'searchBank/searchBank.html',
      controller: 'SearchBankCtrl'
    });
  }])

  .controller('SearchBankCtrl', ["$scope", "$http", "$filter", "$window", function ($scope, $http, $filter, $window) {

    $scope.init = function () {
      $scope.data = {
        bankSelected: null,
        bankOptions: [],
        itemsPerPage: 10,
        pageOptions: [10, 20, 30]
      }
      try {
        var bankOptions = JSON.parse(window.localStorage.getItem('bankOptions'))
      } catch {
        var bankOptions = null
      }
      if (!bankOptions) {
        $scope.data.bankOptions = [{
            name: "Mumbai",
            favourite: false,
            result: {}
          },
          {
            name: "Delhi",
            favourite: false,
            result: {}
          },
          {
            name: "Bengaluru",
            favourite: false,
            result: {}
          },
          {
            name: "Kolkata",
            favourite: false,
            result: {}
          },
          {
            name: "Chennai",
            favourite: false,
            result: {}
          }
        ]
      } else {
        $scope.data.bankOptions = bankOptions
      }
      angular.forEach($scope.data.bankOptions, function (element) {
        element.result = {
          banksList: [],
          totalItems: 0,
          currentPage: 1,
          maxSize: 10
        }
      })
      $scope.resultLoading = false;
    }

    $scope.selectBank = function (bankSelected) {
      if (bankSelected && bankSelected.name && bankSelected.result.banksList.length == 0) {
        $scope.resultLoading = true;
        $http.get('https://vast-shore-74260.herokuapp.com/banks?city=' + bankSelected.name.toUpperCase()).then(function (data) {
          $scope.resultLoading = false;
          if (data.status === 200) {
            bankSelected.result = {
              banksList: data.data,
              totalItems: data.data.length,
              currentPage: 1,
              maxSize: 10
            }
            $scope.pageChanged()
          }
        });
      } else {
        bankSelected.result.filteredList = []
        bankSelected.result.currentPage = 1
        $scope.pageChanged()
      }
    }

    $scope.pageChanged = function () {
      if ($scope.data.itemsPerPage) {
        var allItems = $filter('filter')($scope.data.bankSelected.result.banksList, {
          "$": $scope.data.searchText
        });
        $scope.data.bankSelected.result.totalItems = allItems.length;
        $scope.data.bankSelected.result.filteredList = allItems.slice(
          (($scope.data.bankSelected.result.currentPage - 1) * $scope.data.itemsPerPage),
          (($scope.data.bankSelected.result.currentPage) * $scope.data.itemsPerPage));
      } else {
        $scope.data.bankSelected.filteredList = []
        $scope.data.bankSelected.totalItems = 0
      }
    };

    $scope.markFavourite = function (bankSelected, favouriteBool) {
      angular.forEach($scope.data.bankOptions, function (element, index) {
        if (element.name === bankSelected.name) {
          element.favourite = favouriteBool
        }
      })
      window.localStorage.setItem('bankOptions', JSON.stringify($scope.data.bankOptions))
    }

    $scope.openBankDetails = function (bankData) {
      window.localStorage.setItem(bankData.bank_id, JSON.stringify(bankData))
      $window.open('#!/bank/' + bankData.bank_id, '_blank');
      // $location.path('/bank/' + bankData.bank_id)
    }

    $scope.init()

  }]);