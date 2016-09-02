var app = angular.module('decisionApp', ['ngRoute', 'angular-spinkit']);

app.directive('cpShowResults', function(){
  return {
    restrict: 'E',
    templateUrl: 'views/results.html'
  }
})

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
    .when('/eathere', {
      templateUrl: 'views/results.html',
      controller: "DecisionController"
    })
    .when('/signup', {
      templateUrl: 'views/signup.html',
      controller: "DecisionController"
    })
    .when('/signin', {
      templateUrl: 'views/signin.html',
      controller: "DecisionController"
    })
});
