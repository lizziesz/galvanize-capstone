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
      searchYelpCity: function(city, state, category) {
        return $http.get('/api/yelp/' + city + '/' + state + '/' + category);
      },
      getUsers: function() {
        return $http.get('/api/users');
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

app.service("DecisionInterceptor", function DecisionInterceptor() {
  return {
    request: function(config){
      // console.log(localStorage.jwt);
      if (localStorage.jwt) {
        config.headers.Authorization = 'Bearer ' + localStorage.jwt;
      }
      return config;
    }
  }
})
