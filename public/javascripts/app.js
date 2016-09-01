var app = angular.module('decisionApp', ['ngRoute', 'angular-spinkit']);

app.directive('cpShowResults', function(){
  return {
    restrict: 'E',
    templateUrl: 'views/results.html'
  }
})

app.directive('routeLoadingIndicator', function($rootScope) {
  return {
    restrict: 'E',
    template: "<div ng-show='isRouteLoading' class='loading-indicator'>" +
    "<div class='loading-indicator-body'>" +
    "<h3 class='loading-title'>Loading...</h3>" +
    "<div class='spinner'><rotating-plane-spinner></rotating-plane-spinner></div>" +
    "</div>" +
    "</div>",
    replace: true,
    link: function(scope, elem, attrs) {
      scope.isRouteLoading = false;
      $rootScope.$on('$routeChangeStart', function(){
        scope.isRouteLoading = true;
      });
      $rootScope.$on('$routeChangeSuccess', function(){
        scope.isRouteLoading = false;
      });
    }
  }
});

app.controller("DecisionController", ['$scope', 'YelpAPIService', '$timeout', '$http', function($scope, YelpAPIService, $timeout, $http) {
  $scope.view = {};
  $scope.view.inputLocation = true;
  $scope.view.restaurants = [];
  $scope.view.changeInput = function(){
    $scope.view.inputLocation = false;
    $scope.view.inputTypeOfFood = true;
  }

  $scope.view.getLocation = function() {
    $scope.view.loading = true;
    console.log("Location Location");
    // $scope.view.showLongAndLat = true;

    var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    function success(pos) {
      var crd = pos.coords;

      console.log('Your current position is:');
      console.log('Latitude : ' + crd.latitude);
      console.log('Longitude: ' + crd.longitude);
      console.log('More or less ' + crd.accuracy + ' meters.');

      $scope.view.latitude = crd.latitude;
      $scope.view.longitude = crd.longitude;
      console.log($scope.view.latitude);
      $http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + $scope.view.latitude + ',' + $scope.view.longitude + '&key=AIzaSyBG3ONRAzVaudSq-Hnz7_qE5AIMV5b_EQU').then(function(data) {
        console.log(data);
        var addressArray = data.data.results[0].formatted_address.split(',');
        console.log(addressArray);
        var stateZipArray = addressArray[2].split(' ');
        console.log(stateZipArray);
        $scope.view.address = addressArray[0];
        $scope.view.city = addressArray[1].trim();
        $scope.view.state = stateZipArray[1];
        $scope.view.zip = stateZipArray[2];
        $scope.view.loading = false;
      })

    };

    function error(err) {
      console.warn('ERROR(' + err.code + '): ' + err.message);
    };

    navigator.geolocation.getCurrentPosition(success, error, options);

  }

  $scope.view.businesses = [];

  $scope.view.searchYelp = function() {
    // $timeout(function(){
      // $location.path('/eathere');
    // }, 3000);

      YelpAPIService.searchYelpCity($scope.view.city).then(function(data) {
        function getRandomInt(min, max) {
          return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        var randomNum = getRandomInt(0, 19);
        console.log(randomNum);
        console.log(data.data.businesses[randomNum].name);
        console.log($scope.view.restaurants);
        $scope.view.restaurants.push(data.data.businesses[randomNum]);
        console.log($scope.view.restaurants);
        $scope.view.inputTypeOfFood = false;
        $scope.view.showResults = true;
        // $location.path('/eathere');
        // $scope.view.result = data.data.businesses[randomNum];
        // console.log($scope.view.restaurants[0].name);
      })

  }

  $scope.view.searchYelpAgain = function() {
    YelpAPIService.searchYelpCity($scope.view.city).then(function(data) {
      function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }
      var randomNum = getRandomInt(0, 19);
      console.log(randomNum);
      console.log(data.data.businesses[randomNum].name);
      console.log($scope.view.restaurants);
      $scope.view.restaurants.pop();
      $scope.view.restaurants.push(data.data.businesses[randomNum]);
      console.log($scope.view.restaurants);
      $scope.view.inputTypeOfFood = false;
      $scope.view.showResults = true;
    })
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
