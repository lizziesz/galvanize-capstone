var app = angular.module('decisionApp', ['ngRoute']);

app.controller("DecisionController", ['$scope', function($scope) {
  $scope.view = {};
  $scope.view.inputLocation = true;

  $scope.view.changeInput = function(){
    $scope.view.inputLocation = false;
    $scope.view.inputTypeOfFood = true;
  }
  
}]);

app.config(function($routeProvider){
  $routeProvider
    .when('/', {
      templateUrl: 'views/home.html',
      controller: "DecisionController"
    })
    .when('/decide', {
      templateUrl: 'views/search.html',
      controller: "DecisionController"
    })
});
