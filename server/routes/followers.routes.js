const router = require('express').Router(); 
const controller = require('../controllers/followers.controllers.js')
const verifyUser = require('../middleware/verify-user.js')


router.put('/api/follow/:id', verifyUser,  controller.followUser);
router.put('/api/unfollow/:unfollowUser', verifyUser, controller.unfollowUser);

module.exports = router;