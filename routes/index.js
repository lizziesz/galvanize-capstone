require('dotenv').config();
var express = require('express');
var router = express.Router();
var oauthSignature = require('oauth-signature');
var yelp = require("node-yelp");
var knex = require("../db/knex");
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var bearerToken = require('express-bearer-token');
var jwtDecode = require('jwt-decode');
var token;
var errors;

function protect(req,res,next) {
  // var decoded = jwtDecode(req.token);
  // console.log(decoded);
  // console.log("REQ.JWT: " + req.token);
  jwt.verify(req.token, process.env.SECRET, function (err,decoded) {
    if (!err) {

      next();
    } else {
      res.status(400).send('Bad Request');
    }
  });
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

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
});

router.get('/api/users', function(req, res, next) {
  // res.json("['hi', 'ivy']")
  knex('users').then(function(data) {
    res.json(data);
  });
});

router.post('/api/signup', function(req, res, next) {
  var password = bcrypt.hashSync(req.body.password, 8);

  knex('users')
    .where({
      username: req.body.username
    })
    .then(function(data) {
      if(data.length > 0) {
        res.json({errors: "username is already taken"});
      }
      else {
        knex('users')
        .insert({
          username: req.body.username,
          password: password,
          first_name: capitalizeFirstLetter(req.body.first_name),
          last_name: capitalizeFirstLetter(req.body.last_name),
          is_admin: false
        }).returning("*")
        .then(function(user) {
          token = jwt.sign({ id: user[0].id, username: user[0].username, is_admin: user[0].is_admin, first_name: user[0].first_name}, process.env.SECRET);
          console.log(token);
          res.json({token:token});
        }).catch(function(err) {
          console.log(err);
          res.json({errors: "There was an error"});
        })
      }
    })
});

router.post('/api/signin', function(req, res, next) {
  knex('users')
  .where({
    username: req.body.username
  })
  .first()
  .then(function(data) {
    if(!data) {
      res.json({errors: 'username or password is incorrect'})
    }
    else if(bcrypt.compareSync(req.body.password, data.password)) {
      token = jwt.sign({ id: data.id, username: data.username, is_admin: data.is_admin, first_name: data.first_name }, process.env.SECRET);
      res.json({token:token});
      console.log("token token: " + token);
      // res.redirect('/bikes');
    } else{
      console.log('username or password is incorrect');
      res.json({errors: 'username or password is incorrect'});
    }
  }).catch(function(err) {
    console.log(err);
    next(err)
  })
});

router.get('/api/places', function(req, res, next) {
  knex('places').then(function(data) {
    res.json(data);
  });
});

router.post('/api/places', function(req, res, next) {
  knex('places')
  .where({
    user_id: req.body.user_id
  })
  .then(function(data) {
    console.log(data);
    for(var i=0; i<data.length; i++) {
      if(data[i].yelp_url === req.body.yelp_url) {
        return "Already there";
      }
    }
    knex('places').insert({
      user_id: req.body.user_id,
      name: req.body.name,
      image: req.body.image,
      address_line_1: req.body.address_line_1,
      city: req.body.city,
      state: req.body.state,
      zip: req.body.zip,
      yelp_url: req.body.yelp_url
    }).then(function(data) {
      res.redirect('/');
    });
  });
});

router.get('/api/places/:id', function(req, res, next) {
  knex('places')
  .where({
    user_id: req.params.id
  })
  .then(function(data) {
    res.json(data);
  });
});

module.exports = router;
