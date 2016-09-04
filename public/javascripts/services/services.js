// angular.module("decisionApp")
//   .factory("DecisionService", function($http) {
//
//   })

function randomString(length, chars) {
  var result = '';
  for(var i=length; i > 0; --i) {
    result += chars[Math.round(Math.random() * (chars.length - 1))];
  }
  return result;
}

angular.module("decisionApp")
  .factory("YelpAPIService", function($http) {
    return {
      searchYelpCity: function(city, state, radius, category) {
        return $http.get('/api/yelp/' + city + '/' + state + '/' + radius + '/' + category);
      },
      searchYelp: function(city, state, category) {
        return $http.get('/api/yelp2/' + city + '/' + state + '/' + category);
      },
      searchYelpLat: function(city, state, latitude, longitude, radius, category) {
        return $http.get('/api/yelp3/' + city + '/' + state + '/' + latitude + '/' + longitude + '/' + radius + '/' + category);
      },
      searchYelpLatNoRad: function(city, state, latitude, longitude, category) {
        return $http.get('/api/yelp4/' + city + '/' + state + '/' + latitude + '/' + longitude + '/' + category);
      },
      getUsers: function() {
        return $http.get('/api/users');
      },
      addPlace: function(user_id, name, image, address_line_1, city, state, zip, yelp_url) {
        var newPlace = {};
        newPlace.user_id = user_id;
        newPlace.name = name;
        newPlace.image = image;
        newPlace.address_line_1 = address_line_1;
        newPlace.city = city;
        newPlace.state = state;
        newPlace.zip = zip;
        newPlace.yelp_url = yelp_url;
        return $http.post('/api/places', newPlace)
      },
      addPlaceTwo: function(user_id, name, image, address_line_1, address_line_2, city, state, zip, yelp_url){
        var newPlace = {};
        newPlace.user_id = user_id;
        newPlace.name = name;
        newPlace.image = image;
        newPlace.address_line_1 = address_line_1;
        newPlace.address_line_2 = address_line_2;
        newPlace.city = city;
        newPlace.state = state;
        newPlace.zip = zip;
        newPlace.yelp_url = yelp_url;
        return $http.post('/api/placestwo', newPlace);
      }
    }
  })
  .factory("SignUpService", function($http) {
    return {
      getUsers: function() {
        return $http.get('/api/users');
      },
      signUp: function(array, username, password, first_name, last_name) {
        var newUser = {};
        newUser.username = username.toLowerCase();
        newUser.password = password;
        newUser.first_name = first_name;
        newUser.last_name = last_name;
        array.push(newUser);
        return $http.post('/api/signup', newUser);
      },
      signIn: function(username, password) {
        var user = {};
        user.username = username.toLowerCase();
        user.password = password;
        return $http.post('/api/signin', user);
      }
    }
  })
  .factory("DashboardService", function($http) {
    return {
      getPlaces: function(id) {
        return $http.get('/api/places/' + id);
      },
      addFavorite: function(place_id) {
        return $http.post('/api/favorites/' + place_id);
      },
      removeFavorite: function(place_id) {
        return $http.post('/api/removefavorite/' + place_id);
      }
    }
  })
  .factory("FavoriteService", function($http) {
    return {
      getFaves: function(id) {
        return $http.get('/api/faves/' + id);
      }
    }
  })

app.service("DecisionInterceptor", function DecisionInterceptor() {
  return {
    request: function(config){
      if (localStorage.jwt && config.url.indexOf('googleapis') === -1) {
        config.headers.Authorization = 'Bearer ' + localStorage.jwt;
      }
      return config;
    }
  }
})
