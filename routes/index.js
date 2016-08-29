require('dotenv').config();
var express = require('express');
var router = express.Router();
var oauthSignature = require('oauth-signature');
var yelp = require("node-yelp");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
//
// router.get('/api/yelp', function(req, res, next) {
//   console.log("GET YELP");
//   var yelps = {help: ['help', 'me']}
//   res.json(yelps);
// // });

router.get('/api/yelp', function(req, res, next) {
  var client = yelp.createClient({
    oauth: {
      "consumer_key": process.env.oauth_consumer_key,
      "consumer_secret": process.env.consumerSecret,
      "token": process.env.oauth_token,
      "token_secret": process.env.tokenSecret
    },

    // Optional settings:
    httpClient: {
      maxSockets: 25  // ~> Default is 10
    }
  });
  client.search({
    terms: "food",
    location: "Denver"
  }).then(function (data) {
    var businesses = data.businesses;
    var location = data.region;
    res.json(data);
    // ...
  }).catch(function(error) {
    console.log(error);
  })
})

module.exports = router;
