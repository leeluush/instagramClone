const likesController = require('./likes.controller');
const Like = require('./like.model')
const likesRoutes = require('./likes.routes');

module.exports = {
  likesController,
  Like,
  likesRoutes
};
