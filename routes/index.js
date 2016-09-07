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

router.get('/api/yelp/:city/:state/:radius/:category', function(req, res, next) {
  var city = req.params.city;
  var state = req.params.state;
  var radius = req.params.radius;
  if(req.params.category === 'undefined') {
    category = '';
  }
  else {
    category = req.params.category;
  }

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
    term: "restaurants",
    location: city + state,
    radius_filter: radius,
    category_filter: category
  }).then(function (data) {
    var businesses = data.businesses;
    var location = data.region;
    res.json(data);
    // ...
  }).catch(function(error) {
    console.log("ERROR" + error);
  })
});

router.get('/api/yelp2/:city/:state/:category', function(req, res, next) {
  var city = req.params.city;
  var state = req.params.state;
  if(req.params.category === 'undefined') {
    category = '';
  }
  else {
    category = req.params.category;
  }

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
    term: "restaurants",
    location: city + state,
    category_filter: category
  }).then(function (data) {
    var businesses = data.businesses;
    var location = data.region;
    res.json(data);
    // ...
  }).catch(function(error) {
    console.log("ERROR" + error);
  })
});

router.get('/api/yelp3/:city/:state/:latitude/:longitude/:radius/:category', function(req, res, next) {
  var city = req.params.city;
  var state = req.params.state;
  var latitude = req.params.latitude;
  var longitude = req.params.longitude;
  var radius = req.params.radius;
  if(req.params.category === 'undefined') {
    category = '';
  }
  else {
    category = req.params.category;
  }

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
    term: "restaurants",
    location: city + state,
    cll: latitude + ',' + longitude,
    radius_filter: radius,
    category_filter: category
  }).then(function (data) {
    var businesses = data.businesses;
    var location = data.region;
    res.json(data);
    // ...
  }).catch(function(error) {
    console.log("ERROR" + error);
  })
});

router.get('/api/yelp4/:city/:state/:latitude/:longitude/:category', function(req, res, next) {
  var city = req.params.city;
  var state = req.params.state;
  var latitude = req.params.latitude;
  var longitude = req.params.longitude;
  if(req.params.category === 'undefined') {
    category = '';
  }
  else {
    category = req.params.category;
  }

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
    term: "restaurants",
    location: city + state,
    cll: latitude + ',' + longitude,
    category_filter: category
  }).then(function (data) {
    var businesses = data.businesses;
    var location = data.region;
    res.json(data);
    // ...
  }).catch(function(error) {
    console.log("ERROR" + error);
  })
});

router.get('/api/yelpfave/:name/:city/:state', function(req, res, next) {
  var name = req.params.name;
  var city = req.params.city;
  var state = req.params.state;

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
    term: name,
    location: city + state
  }).then(function (data) {
    var businesses = data.businesses;
    var location = data.region;
    res.json(data);
    // ...
  }).catch(function(error) {
    console.log("ERROR" + error);
  })
});

router.get('/api/users', function(req, res, next) {
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
    } else {
      res.json({errors: 'username or password is incorrect'});
    }
  }).catch(function(err) {
    console.log(err);
    res.json({errors: "There was an error"});
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
      yelp_url: req.body.yelp_url,
      is_favorite: false
    }).then(function(data) {
      res.redirect('/');
    });
  });
});

router.post('/api/placestwo', function(req, res, next) {
  knex('places')
  .where({
    user_id: req.body.user_id
  })
  .then(function(data) {
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
      address_line_2: req.body.address_line_2,
      city: req.body.city,
      state: req.body.state,
      zip: req.body.zip,
      yelp_url: req.body.yelp_url,
      is_favorite: false
    }).then(function(data) {
      res.redirect('/');
    });
  });
});

router.post('/api/placesfave', function(req, res, next) {
  knex('places')
  .where({
    user_id: req.body.user_id
  })
  .then(function(data) {
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
      yelp_url: req.body.yelp_url,
      is_favorite: true
    }).then(function(data) {
      res.redirect('/');
    });
  });
});

router.post('/api/placestwofave', function(req, res, next) {
  knex('places')
  .where({
    user_id: req.body.user_id
  })
  .then(function(data) {
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
      address_line_2: req.body.address_line_2,
      city: req.body.city,
      state: req.body.state,
      zip: req.body.zip,
      yelp_url: req.body.yelp_url,
      is_favorite: true
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

router.post('/api/favorites/:id', function(req, res, next) {
  knex('places')
  .where({
    id: req.params.id
  })
  .update({
    is_favorite: true
  }).then(function(){
    res.redirect('/');
  });
});

router.post('/api/removefavorite/:id', function(req, res, next) {
  knex('places')
  .where({
    id: req.params.id
  })
  .update({
    is_favorite: false
  }).then(function(){
    res.redirect('/');
  });
});

router.get('/api/faves/:id', function(req, res, next) {
  knex('places')
  .where({
    user_id: req.params.id,
    is_favorite: true
  }).then(function(data) {
    res.json(data);
  });
});

module.exports = router;
