const commentsController = require('./comments.controller');
const Comment = require('./comment.model')
const commentsRoutes = require('./comments.routes');

module.exports = {
  commentsController,
  Comment,
  commentsRoutes
};
