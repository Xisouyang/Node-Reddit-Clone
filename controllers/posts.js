const Post = require('../models/post');

var checkUser = (req, res, next) => {
  console.log("checking user")
  if (req.user) {
    return next();
  }
  return res.status(401).send();
}

module.exports = (server) => {

  // Index
  server.get('/', (req, res) => {
    var currentUser = req.user;
    Post.find({})
    .then(posts => {
      console.log(currentUser)
      res.render("posts-index", { posts, currentUser });
    })
    .catch(err => {
      console.log(err.message);
    });
  })

  // New
  server.get('/posts/new', checkUser, (req, res) => {
      var currentUser = req.user;
      res.render('posts-new', {currentUser});
  })

  // Create
  server.post('/posts/new', checkUser, (req, res) => {
    if (req.user) {
      // Instantiate instance of post model
      const post = new Post(req.body);
      // Save instance to DB
      post.save((err, post) => {
        return res.redirect(`/`)
      })
    } else {
      return res.status(401);
    }
  });

  // Show
  server.get('/posts/:id', function(req, res) {
    var currentUser = req.user;
    // Look up post
    Post.findById(req.params.id).populate('comments')
      .then(post => {
        res.render('posts-show', { post, currentUser })
      })
      .catch(err => {
        console.log(err.message)
      });
  });

  // Subreddit
  server.get("/n/:subreddit", function(req, res) {
    var currentUser = req.user;
    Post.find({ subreddit: req.params.subreddit })
      .then(posts => {
        res.render("posts-index", { posts, currentUser });
      })
      .catch(err => {
        console.log(err);
      });
  });
};
