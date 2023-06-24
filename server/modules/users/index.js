const userController = require('./users.conrtoller');
const User = require('./user.model')
const userRoutes = require('./users.routes');

module.exports = {
  userController,
  User,
  userRoutes
};
