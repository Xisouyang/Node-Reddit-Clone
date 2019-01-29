const express = require('express')
const server = express()
var exphbs = require('express-handlebars');

server.engine('handlebars', exphbs({ defaultLayout: 'main' }))
server.set('view engine', 'handlebars')

server.get('/', (req, res) => {
  res.render('home', { msg: 'Handlebars are Cool!' });
})

server.listen(4000, () => {
  console.log("listening on port 4000")
})
