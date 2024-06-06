const express = require('express');
const controller = require('../controllers/followers.controllers');
const { protect } = require('../controllers/authController');

const router = express.Router();

router.route('/follow/:id').put(protect, controller.followUser);

router.route('/unfollow/:id').put(protect, controller.unfollowUser);

router.route('/follow/check/:id').get(protect, controller.isFollowing);

module.exports = router;
