var app = angular.module('decisionApp', ['ngRoute', 'angular-spinkit']);

app.config(function($routeProvider, $httpProvider){
  $httpProvider.interceptors.push('DecisionInterceptor');
  $routeProvider
    .when('/', {
      templateUrl: 'views/home.html'
    })
    .when('/decide', {
      templateUrl: 'views/search.html',
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
    .when('/decide/favorites/:id', {
      templateUrl: 'views/searchfave.html',
      controller: 'FavoriteController'
    })
});

app.run(function($rootScope, $location) {

  if (localStorage.jwt) {
    $rootScope.user = jwt_decode(localStorage.jwt);
    console.log($rootScope.user);
  }
});
