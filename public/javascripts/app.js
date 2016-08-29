var app = angular.module('decisionApp', ['ngRoute']);

app.controller("DecisionController", ['$scope', 'YelpAPIService', function($scope, YelpAPIService) {
  $scope.view = {};
  $scope.view.inputLocation = true;

  $scope.view.changeInput = function(){
    $scope.view.inputLocation = false;
    $scope.view.inputTypeOfFood = true;
  }

  $scope.view.getLocation = function() {
    console.log("Location Location");
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
    };

    function error(err) {
      console.warn('ERROR(' + err.code + '): ' + err.message);
    };

    navigator.geolocation.getCurrentPosition(success, error, options);
  }

  $scope.view.businesses = [];

  $scope.view.searchYelp = function() {
    YelpAPIService.searchYelp().then(function(data) {
      console.log(data);
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
});
