const Post = require('../models/post');

module.exports = (server) => {
  // Create
  server.post('/posts/new', (req, res) => {
    // Instantiate instance of post model
    const post = new Post(req.body);
    // Save instance to DB
    post.save((err, post) => {
      return res.redirect(`/`)
    })
  });
};
