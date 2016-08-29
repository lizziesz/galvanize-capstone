var app = angular.module('decisionApp', ['ngRoute']);

app.controller("decisionController", ['$scope', function($scope) {
  $scope.view = {};
  $scope.view.inputLocation = true;

  $scope.view.changeInput = function(){
    $scope.view.inputLocation = false;
    $scope.view.inputTypeOfFood = true;
  }
  
}])
