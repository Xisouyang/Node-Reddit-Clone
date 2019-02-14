const Comment = require('../models/comment');
const Post = require('../models/post')

var checkUser = (req, res, next) => {
  console.log("checking user")
  if (req.user) {
    return next();
  }
  return res.status(401).send();
}

module.exports = (server) => {
    // Create
    server.post('/posts/:postId/comments', checkUser, (req, res) => {
        // Instantiate instance of model
        const comment = new Comment(req.body);
        comment.author = req.user._id;
        // Save model to DB
        comment
          .save()
          .then(comment => {
            return Post.findById(req.params.postId)
          })
          .then(post => {
            post.comments.unshift(comment);
            // console.log(req.params)
            return post.save()
          })
          .then(post => {
            res.redirect(`/`)
          })
          .catch(err => {
            console.log(err)
          });
    });
};
