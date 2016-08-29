var app = angular.module('decisionApp', ['ngRoute']);

app.controller("decisionController", ['$scope', function($scope) {
  $scope.view = {};
  $scope.view.inputLocation = true;
}])
