var app = angular.module('decisionApp', ['ngRoute', 'angular-spinkit']);

app.config(function($routeProvider, $httpProvider){
  $httpProvider.interceptors.push('DecisionInterceptor');
  $routeProvider
    .when('/', {
      templateUrl: 'views/home.html'
    })
    .when('/about', {
      templateUrl: 'views/about.html'
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
    .when('/favorites', {
      templateUrl: 'views/favenouser.html'
    })
});

app.run(function($rootScope, $location) {
  console.log(localStorage.jwt);
  if (localStorage.jwt) {
    $rootScope.user = jwt_decode(localStorage.jwt);
  }

});
