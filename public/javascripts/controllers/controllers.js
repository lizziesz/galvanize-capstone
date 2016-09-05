function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

app.controller("NavigationController", ['$scope', '$http', '$window', function($scope, $http, $window) {

  $scope.view = {};

  $scope.view.signOut = function() {
    console.log("HI");
    localStorage.clear();
    $window.location.reload();
  }

}])

app.controller("DecisionController", ['$scope', 'YelpAPIService', '$http', '$location', '$window', function($scope, YelpAPIService, $http, $location, $window) {
  $scope.view = {};
  $scope.view.inputLocation = true;
  $scope.view.restaurants = [];

  $scope.view.startOver = function() {
    $window.location.reload();
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
      });

    };

    function error(err) {
      console.warn('ERROR(' + err.code + '): ' + err.message);
    };

    navigator.geolocation.getCurrentPosition(success, error, options);

  }

  $scope.view.changeInput = function(){

    if($scope.view.city && $scope.view.state) {
      $scope.view.inputLocation = false;
      $scope.view.inputRadius = true;
      $scope.view.locationConfirmed = false;
    }
    else if(!$scope.view.city && !$scope.view.state) {
      $scope.view.noCity = true;
      $scope.view.noState = true;
    }
    else if(!$scope.view.city) {
      $scope.view.noCity = true;
    }
    else if(!$scope.view.state) {
      $scope.view.noState = true;
    }

  }

  $scope.view.submitRadius = function() {
    if($scope.view.radius === "noradius") {
      $scope.view.radius = false;
    }
    $scope.view.inputRadius = false;
    $scope.view.inputTypeOfFood = true;
    console.log($scope.view.radius);
  }

  $scope.view.businesses = [];

  $scope.view.searchYelp = function() {
    if($scope.view.category === 'anything') {
      $scope.view.category = 'undefined';
    }
    console.log($scope.view.category);
    if($scope.view.radius && !$scope.view.latitude && !$scope.view.longitude) {
      YelpAPIService.searchYelpCity($scope.view.city, $scope.view.state, $scope.view.radius, $scope.view.category).then(function(data) {
        console.log(data.data);
        if(data.data.businesses.length === 0) {
          $scope.view.inputTypeOfFood = false;
          $scope.view.showResults = true;
          $scope.view.errorMessage = true;
        }
        else {
          var max = data.data.businesses.length - 1;
          var randomNum = getRandomInt(0, max);
          console.log(randomNum);
          console.log(data.data.businesses[randomNum].name);
          console.log($scope.view.restaurants);
          $scope.view.restaurants.push(data.data.businesses[randomNum]);
          console.log($scope.view.restaurants);
          $scope.view.inputTypeOfFood = false;
          $scope.view.showResults = true;
        }
      });
    }
    if(!$scope.view.radius && !$scope.view.latitude && !$scope.view.longitude) {
      YelpAPIService.searchYelp($scope.view.city, $scope.view.state, $scope.view.category).then(function(data) {
        console.log(data.data);
        if(data.data.businesses.length === 0) {
          $scope.view.inputTypeOfFood = false;
          $scope.view.showResults = true;
          $scope.view.errorMessage = true;
        }
        else {
          var max = data.data.businesses.length - 1;
          var randomNum = getRandomInt(0, max);
          console.log(randomNum);
          console.log(data.data.businesses[randomNum].name);
          console.log($scope.view.restaurants);
          $scope.view.restaurants.push(data.data.businesses[randomNum]);
          console.log($scope.view.restaurants);
          $scope.view.inputTypeOfFood = false;
          $scope.view.showResults = true;
        }
      })
    }
    if($scope.view.radius && $scope.view.latitude) {
      YelpAPIService.searchYelpLat($scope.view.city, $scope.view.state, $scope.view.latitude, $scope.view.longitude, $scope.view.radius, $scope.view.category).then(function(data) {
        console.log(data.data);
        if(data.data.businesses.length === 0) {
          $scope.view.inputTypeOfFood = false;
          $scope.view.showResults = true;
          $scope.view.errorMessage = true;
        }
        else {
          var max = data.data.businesses.length - 1;
          var randomNum = getRandomInt(0, max);
          console.log(randomNum);
          console.log(data.data.businesses[randomNum].name);
          console.log($scope.view.restaurants);
          $scope.view.restaurants.push(data.data.businesses[randomNum]);
          console.log($scope.view.restaurants);
          $scope.view.inputTypeOfFood = false;
          $scope.view.showResults = true;
        }
      });
    }
    if(!$scope.view.radius && $scope.view.latitude) {
      YelpAPIService.searchYelpLatNoRad($scope.view.city, $scope.view.state, $scope.view.latitude, $scope.view.longitude, $scope.view.category).then(function(data) {
        console.log(data.data);
        if(data.data.businesses.length === 0) {
          $scope.view.inputTypeOfFood = false;
          $scope.view.showResults = true;
          $scope.view.errorMessage = true;
        }
        else {
          var max = data.data.businesses.length - 1;
          var randomNum = getRandomInt(0, max);
          console.log(randomNum);
          console.log(data.data.businesses[randomNum].name);
          console.log($scope.view.restaurants);
          $scope.view.restaurants.push(data.data.businesses[randomNum]);
          console.log($scope.view.restaurants);
          $scope.view.inputTypeOfFood = false;
          $scope.view.showResults = true;
        }
      });
    }

  }

  $scope.view.searchYelpAgain = function() {
    if($scope.view.radius !== '' && !$scope.view.latitude && !$scope.view.longitude) {
      YelpAPIService.searchYelpCity($scope.view.city, $scope.view.state, $scope.view.radius, $scope.view.category).then(function(data) {
        var max = data.data.businesses.length - 1;
        var randomNum = getRandomInt(0, max);
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
    if(!$scope.view.radius && !$scope.view.latitude && !$scope.view.longitude) {
      YelpAPIService.searchYelp($scope.view.city, $scope.view.state, $scope.view.category).then(function(data) {
        console.log(data.data);
        var max = data.data.businesses.length - 1;
        var randomNum = getRandomInt(0, max);
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
    if($scope.view.radius && $scope.view.latitude) {
      YelpAPIService.searchYelpLat($scope.view.city, $scope.view.state, $scope.view.latitude, $scope.view.longitude, $scope.view.radius, $scope.view.category).then(function(data) {
        console.log(data.data);
        var max = data.data.businesses.length - 1;
        var randomNum = getRandomInt(0, max);
        console.log(randomNum);
        console.log(data.data.businesses[randomNum].name);
        console.log($scope.view.restaurants);
        $scope.view.restaurants.pop();
        $scope.view.restaurants.push(data.data.businesses[randomNum]);
        console.log($scope.view.restaurants);
        $scope.view.inputTypeOfFood = false;
        $scope.view.showResults = true;
      });
    }
    if(!$scope.view.radius && $scope.view.latitude) {
      YelpAPIService.searchYelpLatNoRad($scope.view.city, $scope.view.state, $scope.view.latitude, $scope.view.longitude, $scope.view.category).then(function(data) {
        console.log(data.data);
        var max = data.data.businesses.length - 1;
        var randomNum = getRandomInt(0, max);
        console.log(randomNum);
        console.log(data.data.businesses[randomNum].name);
        console.log($scope.view.restaurants);
        $scope.view.restaurants.pop();
        $scope.view.restaurants.push(data.data.businesses[randomNum]);
        console.log($scope.view.restaurants);
        $scope.view.inputTypeOfFood = false;
        $scope.view.showResults = true;
      });
    }

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
    $location.path('/dashboard/' + user_id);
    $window.location.reload();
  }

  $scope.view.addRestaurantTwo = function(id, name, image, address1, address2, address3, yelp_url) {
    console.log(address2);
    console.log(address3);
    var address3Array = address3.split(' ');
    var city = address3Array[0].substring(0, address3Array[0].length - 1);
    var user_id = id;
    var name = name;
    var image = image;
    var address_line_1 = address1;
    var address_line_2 = address2;
    var state = address3Array[1];
    var zip = address3Array[2];
    var yelp_url = yelp_url;
    YelpAPIService.addPlaceTwo(user_id, name, image, address_line_1, address_line_2, city, state, zip, yelp_url);
    $location.path('/dashboard/' + user_id);
    $window.location.reload();
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

  DashboardService.getFavorites($routeParams.id).then(function(data) {
    $scope.view.userFaves = data.data;
  });

  $scope.view.addFavorite = function(place_id) {
    console.log("FAVE FAVE FAVE");
    DashboardService.addFavorite(place_id);
  }

  $scope.view.removeFavorite = function(place_id) {
    DashboardService.removeFavorite(place_id);
  }

}]);

app.controller("FavoriteController", ['$scope', '$http', '$routeParams', 'FavoriteService', function($scope, $http, $routeParams, FavoriteService) {
  $scope.view = {};
  $scope.view.faveRestaurants = [];

  FavoriteService.getFaves($routeParams.id).then(function(data) {
    console.log("ALL FAVES");
    console.log(data.data);
    $scope.view.favoritePlaces = data.data;
  });

  $scope.view.searchFavorites = function() {
    var randomNum = getRandomInt(0, $scope.view.favoritePlaces.length -1);
    $scope.view.faveRestaurants.push($scope.view.favoritePlaces[randomNum]);
    console.log($scope.view.faveRestaurants);
    $scope.view.faveResults = true;
  }

  $scope.view.searchFavesAgain = function() {
    console.log("RUN AGAIN");
    var randomNum = getRandomInt(0, $scope.view.favoritePlaces.length -1);
    $scope.view.faveRestaurants.pop();
    $scope.view.faveRestaurants.push($scope.view.favoritePlaces[randomNum]);
  }

}]);
