require('dotenv').config();

const bodyParser = require('body-parser');
const expressValidator = require('express-validator');

var cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const express = require('express');
const server = express();
var exphbs = require('express-handlebars');

server.use(cookieParser());

server.engine('handlebars', exphbs({ defaultLayout: 'main' }))
server.set('view engine', 'handlebars')

// Use Body Parser
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));

// Add after body parser initialization!
server.use(expressValidator());

var checkAuth = (req, res, next) => {
  console.log("Checking authentication");
  if (typeof req.cookies.nToken === "undefined" || req.cookies.nToken === null) {
    req.user = null;
  } else {
    var token = req.cookies.nToken;
    var decodedToken = jwt.decode(token, { complete: true }) || {};
    console.log(decodedToken)
    req.user = decodedToken.payload;
  }

  next();
};


server.use(checkAuth);

require('./data/reddit-db');
require('./controllers/posts.js')(server);
require('./controllers/comments.js')(server);
require('./controllers/auth.js')(server);


server.listen(4000, () => {
  console.log("listening on port 4000")
})

module.exports = server;
