const Comment = require('../models/comment');
const Post = require('../models/post')

module.exports = (server) => {
    // Create
    server.post('/posts/:postId/comments', (req, res) => {
        // Instantiate instance of model
        const comment = new Comment(req.body);
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
