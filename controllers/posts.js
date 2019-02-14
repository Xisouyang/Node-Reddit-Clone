const Post = require('../models/post');
const User = require('../models/user');

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
    Post.find().populate('author')
    .then(posts => {
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
      // Instantiate instance of post model
      const post = new Post(req.body);
      post.author = req.user._id;
      post.save()
           .then(post => {
               return User.findById(req.user._id);
           })
           .then(user => {
               user.posts.unshift(post);
               user.save();
               // REDIRECT TO THE NEW POST
               res.redirect(`/posts/${post._id}`);
           })
           .catch(err => {
               console.log(err.message);
           });
  });

  // Show
  server.get('/posts/:id', function(req, res) {
    var currentUser = req.user;
    console.log(currentUser)
    // Look up post
    Post.findById(req.params.id).populate({path: 'comments', populate: {path: 'author'}}).populate('author')
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
    Post.find({ subreddit: req.params.subreddit }).populate('author')
      .then(posts => {
        res.render("posts-index", { posts, currentUser });
      })
      .catch(err => {
        console.log(err);
      });
  });
};
