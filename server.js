const bodyParser = require('body-parser');
const expressValidator = require('express-validator');

const express = require('express');
const server = express();
var exphbs = require('express-handlebars');

server.engine('handlebars', exphbs({ defaultLayout: 'main' }))
server.set('view engine', 'handlebars')

// Use Body Parser
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));

// Add after body parser initialization!
server.use(expressValidator());

require('./data/reddit-db');
require('./controllers/posts.js')(server);


server.get('/', (req, res) => {
  res.render('home', { msg: 'Handlebars are Cool!' });
})

server.get('/posts/new', (req, res) => {
  res.render('posts-new', {});
})



server.listen(4000, () => {
  console.log("listening on port 4000")
})
