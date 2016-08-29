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
      // "retrieveYelp": function(name, callback) {
      //     var method = 'GET';
      //     var url = 'http://api.yelp.com/v2/search';
      //     var params = {
      //             callback: 'angular.callbacks._0',
      //             location: 'San+Francisco',
      //             oauth_consumer_key: process.env.oauth_consumer_key, //Consumer Key
      //             oauth_token: process.env.oauth_token, //Token
      //             oauth_signature_method: "HMAC-SHA1",
      //             oauth_timestamp: new Date().getTime(),
      //             oauth_nonce: randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'),
      //             term: 'restaurants'
      //         };
      //     var consumerSecret = process.env.consumerSecret; //Consumer Secret
      //     var tokenSecret = process.env.tokenSecret; //Token Secret
      //     var signature = oauthSignature.generate(method, url, params, consumerSecret, tokenSecret, { encodeSignature: false});
      //     params['oauth_signature'] = signature;
      //     $http.jsonp(url, {params: params}).success(callback);
      // }
      searchYelp: function() {
        return $http.get('/api/yelp');
      }
    }
  })
