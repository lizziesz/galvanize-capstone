var app = angular.module('decisionApp', ['ngRoute', 'angular-spinkit']);

app.directive('cpShowResults', function(){
  return {
    restrict: 'E',
    templateUrl: 'views/results.html'
  }
})

app.config(function($routeProvider, $httpProvider){
  $httpProvider.interceptors.push('DecisionInterceptor');
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
      controller: "SignUpController"
    })
    .when('/signin', {
      templateUrl: 'views/signin.html',
      controller: "SignUpController"
    })
    .when('/dashboard/:id', {
      templateUrl: 'views/dashboard.html',
      controller: 'DashboardController'
    })
});

app.run(function($rootScope, $location) {

  if (localStorage.jwt) {
    $rootScope.user = jwt_decode(localStorage.jwt);
    console.log($rootScope.user);
  }
});
