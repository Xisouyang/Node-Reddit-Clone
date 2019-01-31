const Post = require('../models/post');

module.exports = (server) => {

  // Index
  server.get('/', (req, res) => {
    Post.find({})
    .then(posts => {
      res.render("posts-index", { posts });
    })
    .catch(err => {
      console.log(err.message);
    });
  })

  // New
  server.get('/posts/new', (req, res) => {
    res.render('posts-new', {});
  })

  // Create
  server.post('/posts/new', (req, res) => {
    // Instantiate instance of post model
    const post = new Post(req.body);
    // Save instance to DB
    post.save((err, post) => {
      return res.redirect(`/`)
    })
  });

  // Show
  server.get('/posts/:id', function(req, res) {
    // Look up post
    Post.findById(req.params.id)
      .then(post => {
        res.render('posts-show', { post })
      })
      .catch(err => {
        console.log(err.message)
      });
  });
};
