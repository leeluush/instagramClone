const router = require('express').Router(); 
const controller = require('./followers.controllers.js')
const authMiddleware = require('../../middleware/authMiddleware.js')


router.put('/api/follow/:id', controller.followUser);
router.put('/api/unfollow/:unfollowUser', controller.unfollowUser);

module.exports = router;