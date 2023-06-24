const followersController = require('./followers.controllers');
const Follower = require('./follower.model')
const followersRoutes = require('./followers.routes');

module.exports = {
  followersController,
  Follower,
  followersRoutes
};
