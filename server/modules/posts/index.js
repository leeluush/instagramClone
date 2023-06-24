const postsController = require('./posts.controller');
const Post = require('./post.model')
const postsRoutes = require('./posts.routes');

module.exports = {
  postsController,
  Post,
  postsRoutes
};
