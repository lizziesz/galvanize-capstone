var app = angular.module('decisionApp', ['ngRoute']);

app.config(function($routeProvider){
  $routeProvider
    .when('/', {
      templateUrl: 'views/home.html'
    })
    .when('/decide', {
      templateUrl: 'views/search.html'
    })
})
