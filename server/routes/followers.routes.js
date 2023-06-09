const router = require('express').Router(); 
const controller = require('../controllers/followers.controllers.js')
const authMiddleware = require('../middleware/authMiddleware.js')


router.put('/api/follow/:id', authMiddleware,  controller.followUser);
router.put('/api/unfollow/:unfollowUser', authMiddleware, controller.unfollowUser);

module.exports = router;