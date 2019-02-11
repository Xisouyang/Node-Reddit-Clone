// tests/posts.js

const app = require("./../server")
const chai = require("chai")
const chaiHttp = require("chai-http")
const expect = chai.expect;

// Import Post model from our models folder
// so we can use it in our tests
const Post = require('../models/post');
const server = require('../server');

chai.should();
chai.use(chaiHttp);

describe('Posts', function() {
  const agent = chai.request.agent(server);
  // Post that we'll be using for test services
  const samplePost = {
    title: 'post title',
    url: 'https://www.google.com',
    summary: 'post summary'
  };
  it('should create new post w/ valid attributes in /posts/new', function(done) {
    // TODO: Test code goes here

    // How many posts are there now?
    // Make a request to create another
    // Check that the database has one more post in it
    // Check that the response is successful

    // Checks how many posts are in there now
    Post.estimatedDocumentCount()
    .then(function (initialDocCount) {
      chai
        .request(app)
        .post("/posts/new")
        // Fake form post, not actually filling out form
        .set("content-type", "application/x-www-form-urlencoded")
        // Make a request to create another
        .send(samplePost)
        .then(function(res) {
          Post.estimatedDocumentCount()
              .then(function(newDocCount) {
                // Check the database has more than 1 post in it
                expect(res).to.have.status(200);
                // Check that the database has one more post in it
                expect(newDocCount).to.be.equal(initialDocCount + 1)
                done();
              })
              .catch(function(err) {
                done(err)
              });
        })
        .catch(function(err) {
          done(err)
        });
    })
    .catch(function(err) {
      done(err)
    });
  });

  after(function () {
    Post.findOneAndDelete(samplePost);
  });
});
