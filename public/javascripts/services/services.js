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
      searchYelp: function(latitude, longitude) {
        return $http.get('/api/yelp/' + latitude + '/' + longitude);
      },
      searchYelpCity: function(city, state, category) {
        return $http.get('/api/yelp/' + city + '/' + state + '/' + category);
      }
    }
  })
