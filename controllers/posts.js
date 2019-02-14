const Post = require('../models/post');
const User = require('../models/user');

var checkUser = (req, res, next) => {
  // console.log("checking user")
  if (req.user) {
    return next();
  }
  return res.status(401).send();
}

module.exports = (server) => {

  // Index
  server.get('/', function(req, res) {
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
  server.get('/posts/new', checkUser, function(req, res) {
      var currentUser = req.user;
      res.render('posts-new', {currentUser});
  })

  // Create
  server.post('/posts/new', checkUser, function(req, res) {
      // Instantiate instance of post model
      const post = new Post(req.body);
      post.author = req.user._id;
      post.upVotes = [];
      post.downVotes = [];
      post.voteScore = 0;
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
    // console.log(currentUser)
    // Look up post
    // Post.findById(req.params.id).populate({path: 'comments', populate: {path: 'author'}}).populate('author')
    Post.findById(req.params.id).populate('comments').lean()
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
    // Post.find({ subreddit: req.params.subreddit }).populate('author')
    Post.find({ subreddit: req.params.subreddit }).lean()
      .then(posts => {
        res.render("posts-index", { posts, currentUser });
      })
      .catch(err => {
        console.log(err);
      });
  });
  // Vote up
  server.put("/posts/:id/vote-up", function(req, res) {
    Post.findById(req.params.id).exec(function(err, post) {
      post.upVotes.push(req.user._id);
      // console.log("HERE")
      // console.log(post.voteScore)
      // console.log("HERE")
      post.voteScore = post.voteScore + 1;
      post.save();

      res.status(200);
    });
  });
  // Vote down
  server.put("/posts/:id/vote-down", function(req, res) {
    Post.findById(req.params.id).exec(function(err, post) {
      post.downVotes.push(req.user._id);
      post.voteScore = post.voteScore - 1;
      post.save();

      res.status(200);
    });
  });
};
