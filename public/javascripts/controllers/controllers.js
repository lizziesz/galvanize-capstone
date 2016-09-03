app.controller("NavigationController", ['$scope', '$http', '$window', function($scope, $http, $window) {

  $scope.view = {};

  $scope.view.signOut = function() {
    console.log("HI");
    localStorage.clear();
    $window.location.reload();
  }

}])

app.controller("DecisionController", ['$scope', 'YelpAPIService', '$http', '$location', function($scope, YelpAPIService, $http, $location) {
  $scope.view = {};
  $scope.view.inputLocation = true;
  $scope.view.restaurants = [];

  $scope.view.changeInput = function(){
    $scope.view.inputLocation = false;
    $scope.view.inputTypeOfFood = true;
    $scope.view.locationConfirmed = false;
  }

  YelpAPIService.getUsers().then(function(data) {
    console.log(data);
  });

  $scope.view.getLocation = function() {
    $scope.view.loading = true;
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

      $scope.view.latitude = crd.latitude;
      $scope.view.longitude = crd.longitude;
      console.log($scope.view.latitude);

      $http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + $scope.view.latitude + ',' + $scope.view.longitude + '&key=AIzaSyBG3ONRAzVaudSq-Hnz7_qE5AIMV5b_EQU').then(function(data) {
        // console.log(data);
        var addressArray = data.data.results[0].formatted_address.split(',');
        console.log(addressArray);
        var stateZipArray = addressArray[2].split(' ');
        console.log(stateZipArray);
        $scope.view.address = addressArray[0];
        $scope.view.city = addressArray[1].trim();
        $scope.view.state = stateZipArray[1];
        $scope.view.zip = stateZipArray[2];
        $scope.view.loading = false;
        $scope.view.locationConfirmed = true;
      })

    };

    function error(err) {
      console.warn('ERROR(' + err.code + '): ' + err.message);
    };

    navigator.geolocation.getCurrentPosition(success, error, options);

  }

  $scope.view.businesses = [];

  $scope.view.searchYelp = function() {

      if($scope.view.anything) {
        $scope.view.category = '';
      }
      if($scope.view.breakfast_brunch) {
        $scope.view.category = 'breakfast_brunch';
      }
      if($scope.view.bbq) {
        $scope.view.category = 'bbq';
      }
      if($scope.view.burgers) {
        $scope.view.category = 'burgers';
      }
      if($scope.view.chinese) {
        $scope.view.category = 'chinese'
      }
      if($scope.view.comfortfood) {
        $scope.view.category = 'comfortfood'
      }
      if($scope.view.hotdogs) {
        $scope.view.category = 'hotdogs';
      }
      if($scope.view.indpak) {
        $scope.view.category = 'indpak';
      }
      if($scope.view.italian) {
        $scope.view.category = 'italian';
      }
      if($scope.view.japanese) {
        $scope.view.category = 'japanese';
      }
      if($scope.view.mediterranean) {
        $scope.view.category = 'mediterranean';
      }
      if($scope.view.mexican) {
        $scope.view.category = 'mexican';
      }
      if($scope.view.pizza) {
        $scope.view.category = 'pizza';
      }
      if($scope.view.salad) {
        $scope.view.category = 'salad';
      }
      if($scope.view.sandwiches) {
        $scope.view.category = 'sandwiches';
      }
      if($scope.view.seafood) {
        $scope.view.category = 'seafood';
      }
      if($scope.view.steak) {
        $scope.view.category = 'steak';
      }
      if($scope.view.sushi) {
        $scope.view.category = 'sushi';
      }
      if($scope.view.vegan) {
        $scope.view.category = 'vegan';
      }
      if($scope.view.vegetarian) {
        $scope.view.category = 'vegetarian';
      }
      console.log($scope.view.category);
      YelpAPIService.searchYelpCity($scope.view.city, $scope.view.state, $scope.view.category).then(function(data) {
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
      })

  }

  $scope.view.searchYelpAgain = function() {
    YelpAPIService.searchYelpCity($scope.view.city, $scope.view.state, $scope.view.category).then(function(data) {
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

  $scope.view.addRestaurant = function(id, name, image, address1, address2, yelp_url) {
    console.log(address1);
    console.log(address2);
    var address2Array = address2.split(' ');
    console.log(address2Array);
    var city = address2Array[0].substring(0, address2Array[0].length - 1);
    var user_id = id;
    var name = name;
    var image = image;
    var address_line_1 = address1;
    var state = address2Array[1];
    var zip = address2Array[2];
    var yelp_url = yelp_url;
    YelpAPIService.addPlace(user_id, name, image, address_line_1, city, state, zip, yelp_url);
    $location.path('/dashboard/user_id');
  }

}]);

app.controller("SignUpController", ['$scope', '$http', 'SignUpService', '$location', '$window', function($scope, $http, SignUpService, $location, $window) {
  $scope.view = {};

  SignUpService.getUsers().then(function(data) {
    $scope.view.users = data.data;
    console.log($scope.view.users);
  })

  $scope.view.signUp = function() {
    console.log($scope.signUpForm.username);
    SignUpService.signUp($scope.view.users, $scope.signUpForm.username, $scope.signUpForm.password, $scope.signUpForm.first_name, $scope.signUpForm.last_name)
    .then(function(res) {
      if(res.data.errors){
        $scope.view.error = res.data.errors;
      } else {
        localStorage.jwt = res.data.token;
        $location.path('/');
        $window.location.reload();
      }
    });
  }

  $scope.view.signIn = function() {
    $scope.view = {};

    SignUpService.signIn($scope.signInForm.username, $scope.signInForm.password)
      .then(function(res) {
        if(res.data.errors) {
        $scope.view.error = res.data.errors;
      }
      else {
        localStorage.jwt = res.data.token;
        $location.path('/');
        $window.location.reload();
      }
  })
}

}]);

app.controller("DashboardController", ['$scope', '$http', '$routeParams', 'DashboardService', function($scope, $http, $routeParams, DashboardService) {
  $scope.view = {};
  console.log($routeParams.id);
  DashboardService.getPlaces($routeParams.id).then(function(data) {
    console.log(data);
    console.log(data.data);
    $scope.view.userPlaces = data.data;
  });

}]);
