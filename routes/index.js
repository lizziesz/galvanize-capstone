require('dotenv').config();
var express = require('express');
var router = express.Router();
var oauthSignature = require('oauth-signature');
var yelp = require("node-yelp");
var knex = require("knex");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/api/yelp/:latitude/:longitude', function(req, res, next) {
  var latitude = req.params.latitude;
  var longitude = req.params.longitude;
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
    // location: "Denver"
    cll: latitude,longitude
  }).then(function (data) {
    var businesses = data.businesses;
    var location = data.region;
    res.json(data);
    // ...
  }).catch(function(error) {
    console.log(error);
  })
})

router.get('/api/yelp/:city', function(req, res, next) {
  var city = req.params.city;
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
    terms: "restaurants",
    location: city
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
