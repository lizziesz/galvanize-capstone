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

router.get('/api/yelp/:city/:state/:category', function(req, res, next) {
  // console.log("STATE" + req.params.state);
  var city = req.params.city;
  console.log(city);
  var state = req.params.state;
  if(req.params.category === 'undefined') {
    category = '';
  }
  else {
    category = req.params.category;
  }

  // var location = city + '+' + state;
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
    location: city + state,
    category_filter: category
  }).then(function (data) {
    var businesses = data.businesses;
    var location = data.region;
    res.json(data);
    // ...
  }).catch(function(error) {
    console.log("ERROR" + error);
    console.log(city);
  })
})

module.exports = router;
