var app = angular.module('decisionApp', ['ngRoute']);

app.controller("DecisionController", ['$scope', function($scope) {
  $scope.view = {};
  $scope.view.inputLocation = true;
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
