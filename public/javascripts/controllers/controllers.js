function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

app.controller("NavigationController", ['$scope', '$window', function($scope, $window) {

  $scope.view = {};

  $scope.view.signOut = function() {
    localStorage.clear();
    $window.location.reload();
  }

}]);

app.controller("DecisionController", ['$scope', 'YelpAPIService', '$http', '$location', '$window', function($scope, YelpAPIService, $http, $location, $window) {
  $scope.view = {};
  $scope.view.inputLocation = true;
  $scope.view.restaurants = [];

  $scope.view.startOver = function() {
    $window.location.reload();
  }

  $scope.view.getLocation = function() {
    $scope.view.loading = true;

    var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    function success(pos) {
      var crd = pos.coords;

      $scope.view.latitude = crd.latitude;
      $scope.view.longitude = crd.longitude;

      $http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + $scope.view.latitude + ',' + $scope.view.longitude + '&key=AIzaSyBG3ONRAzVaudSq-Hnz7_qE5AIMV5b_EQU').then(function(data) {
        var addressArray = data.data.results[0].formatted_address.split(',');
        var stateZipArray = addressArray[2].split(' ');
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
  }

  $scope.view.businesses = [];

  $scope.view.searchYelp = function() {
    if($scope.view.category === 'anything') {
      $scope.view.category = 'undefined';
    }
    if($scope.view.radius && !$scope.view.latitude && !$scope.view.longitude) {
      YelpAPIService.searchYelpCity($scope.view.city, $scope.view.state, $scope.view.radius, $scope.view.category).then(function(data) {
        if(data.data.businesses.length === 0) {
          $scope.view.inputTypeOfFood = false;
          $scope.view.showResults = true;
          $scope.view.errorMessage = true;
        }
        else {
          var max = data.data.businesses.length - 1;
          var randomNum = getRandomInt(0, max);
          $scope.view.yelpData = data.data.businesses;
          $scope.view.restaurants.pop();
          $scope.view.restaurants.push(data.data.businesses[randomNum]);
          $scope.view.inputTypeOfFood = false;
          $scope.view.showResults = true;
        }
      });
    }
    if(!$scope.view.radius && !$scope.view.latitude && !$scope.view.longitude) {
      YelpAPIService.searchYelp($scope.view.city, $scope.view.state, $scope.view.category).then(function(data) {
        if(data.data.businesses.length === 0) {
          $scope.view.inputTypeOfFood = false;
          $scope.view.showResults = true;
          $scope.view.errorMessage = true;
        }
        else {
          var max = data.data.businesses.length - 1;
          var randomNum = getRandomInt(0, max);
          $scope.view.yelpData = data.data.businesses;
          $scope.view.restaurants.pop();
          $scope.view.restaurants.push(data.data.businesses[randomNum]);
          $scope.view.inputTypeOfFood = false;
          $scope.view.showResults = true;
        }
      });
    }
    if($scope.view.radius && $scope.view.latitude) {
      YelpAPIService.searchYelpLat($scope.view.city, $scope.view.state, $scope.view.latitude, $scope.view.longitude, $scope.view.radius, $scope.view.category).then(function(data) {
        if(data.data.businesses.length === 0) {
          $scope.view.inputTypeOfFood = false;
          $scope.view.showResults = true;
          $scope.view.errorMessage = true;
        }
        else {
          var max = data.data.businesses.length - 1;
          var randomNum = getRandomInt(0, max);
          $scope.view.yelpData = data.data.businesses;
          $scope.view.restaurants.pop();
          $scope.view.restaurants.push(data.data.businesses[randomNum]);
          $scope.view.inputTypeOfFood = false;
          $scope.view.showResults = true;
        }
      });
    }
    if(!$scope.view.radius && $scope.view.latitude) {
      YelpAPIService.searchYelpLatNoRad($scope.view.city, $scope.view.state, $scope.view.latitude, $scope.view.longitude, $scope.view.category).then(function(data) {
        if(data.data.businesses.length === 0) {
          $scope.view.inputTypeOfFood = false;
          $scope.view.showResults = true;
          $scope.view.errorMessage = true;
        }
        else {
          var max = data.data.businesses.length - 1;
          var randomNum = getRandomInt(0, max);
          $scope.view.yelpData = data.data.businesses;
          $scope.view.restaurants.pop();
          $scope.view.restaurants.push(data.data.businesses[randomNum]);
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
        $scope.view.restaurants.pop();
        $scope.view.restaurants.push(data.data.businesses[randomNum]);
        $scope.view.inputTypeOfFood = false;
        $scope.view.showResults = true;
      });
    }
    if(!$scope.view.radius && !$scope.view.latitude && !$scope.view.longitude) {
      YelpAPIService.searchYelp($scope.view.city, $scope.view.state, $scope.view.category).then(function(data) {
        var max = data.data.businesses.length - 1;
        var randomNum = getRandomInt(0, max);
        $scope.view.restaurants.pop();
        $scope.view.restaurants.push(data.data.businesses[randomNum]);
        $scope.view.inputTypeOfFood = false;
        $scope.view.showResults = true;
      });
    }
    if($scope.view.radius && $scope.view.latitude) {
      YelpAPIService.searchYelpLat($scope.view.city, $scope.view.state, $scope.view.latitude, $scope.view.longitude, $scope.view.radius, $scope.view.category).then(function(data) {
        var max = data.data.businesses.length - 1;
        var randomNum = getRandomInt(0, max);
        $scope.view.restaurants.pop();
        $scope.view.restaurants.push(data.data.businesses[randomNum]);
        $scope.view.inputTypeOfFood = false;
        $scope.view.showResults = true;
      });
    }
    if(!$scope.view.radius && $scope.view.latitude) {
      YelpAPIService.searchYelpLatNoRad($scope.view.city, $scope.view.state, $scope.view.latitude, $scope.view.longitude, $scope.view.category).then(function(data) {
        var max = data.data.businesses.length - 1;
        var randomNum = getRandomInt(0, max);
        $scope.view.restaurants.pop();
        $scope.view.restaurants.push(data.data.businesses[randomNum]);
        $scope.view.inputTypeOfFood = false;
        $scope.view.showResults = true;
      });
    }

  }

  $scope.view.addRestaurant = function(id, name, image, address1, address2, yelp_url) {
    var address2Array = address2.split(' ');
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

app.controller("SignUpController", ['$scope', 'SignUpService', '$location', '$window', function($scope, SignUpService, $location, $window) {
  $scope.view = {};

  SignUpService.getUsers().then(function(data) {
    $scope.view.users = data.data;
  });

  $scope.view.signUp = function() {
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
      });
  }

}]);

app.controller("DashboardController", ['$scope', '$routeParams', 'DashboardService', '$window', function($scope, $routeParams, DashboardService, $window) {
  $scope.view = {};

  DashboardService.getPlaces($routeParams.id).then(function(data) {
    $scope.view.userPlaces = data.data;
  });

  DashboardService.getFavorites($routeParams.id).then(function(data) {
    $scope.view.userFaves = data.data;
  });

  $scope.view.addFavorite = function(place_id) {
    DashboardService.addFavorite(place_id);
  }

  $scope.view.removeFavorite = function(place_id) {
    for(var i=0; i<$scope.view.userFaves.length; i++) {
      if($scope.view.userFaves[i].id === place_id) {
        $scope.view.userFaves.splice(i, 1);
      }
    }
    DashboardService.removeFavorite(place_id);
  }

  $scope.view.searchForFave = function() {
    $scope.view.addFaveForm = false;
    $scope.view.searchFaveResults = true;
    DashboardService.searchYelpFave($scope.addFaveForm.name, $scope.addFaveForm.city, $scope.addFaveForm.state).then(function(data) {
      $scope.view.faveBusResults = data.data.businesses;
    });
  }

  $scope.view.addNewFave = function(name, image, address1, address2, yelp_url) {
    var address2Array = address2.split(' ');
    var city = address2Array[0].substring(0, address2Array[0].length - 1);
    var name = name;
    var image = image;
    var address_line_1 = address1;
    var state = address2Array[1];
    var zip = address2Array[2];
    var yelp_url = yelp_url;
    DashboardService.addNewFave($routeParams.id, name, image, address_line_1, city, state, zip, yelp_url);
    $window.location.reload();
  }

  $scope.view.addNewFaveTwo = function(name, image, address1, address2, address3, yelp_url) {
    var address3Array = address3.split(' ');
    var city = address3Array[0].substring(0, address3Array[0].length - 1);
    var name = name;
    var image = image;
    var address_line_1 = address1;
    var address_line_2 = address2;
    var state = address3Array[1];
    var zip = address3Array[2];
    var yelp_url = yelp_url;
    DashboardService.addNewFaveTwo($routeParams.id, name, image, address_line_1, address_line_2, city, state, zip, yelp_url);
    $window.location.reload();
  }

}]);

app.controller("FavoriteController", ['$scope', '$routeParams', 'FavoriteService', function($scope, $routeParams, FavoriteService) {
  $scope.view = {};
  $scope.view.faveRestaurants = [];
  FavoriteService.getFaves($routeParams.id).then(function(data) {
    $scope.view.favoritePlaces = data.data;
  });

  $scope.view.searchFavorites = function() {
    var randomNum = getRandomInt(0, $scope.view.favoritePlaces.length -1);
    $scope.view.faveRestaurants.push($scope.view.favoritePlaces[randomNum]);
    $scope.view.faveResults = true;
  }

  $scope.view.searchFavesAgain = function() {
    var randomNum = getRandomInt(0, $scope.view.favoritePlaces.length -1);
    $scope.view.faveRestaurants.pop();
    $scope.view.faveRestaurants.push($scope.view.favoritePlaces[randomNum]);
  }

}]);
