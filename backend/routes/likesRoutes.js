const express = require('express');
const controller = require('../controllers/likes.controller');
const { protect } = require('../controllers/authController');

const router = express.Router();

// Routes for posts
router
  .route('/posts/:postId')
  .get(controller.getLikesCountPost)
  .post(protect, controller.likePost)
  .delete(protect, controller.unlikePost);

router.route('/likescount/:postId').get(controller.getLikesCountPost);
router.route('/like/:postId/:userId').get(controller.checkLikePost);

// Routes for comments
router
  .route('/comments/:commentId')
  .post(protect, controller.likeComment)
  .delete(protect, controller.unlikeComment);

router
  .route('/comments/likescount/:commentId')
  .get(controller.getLikesCountComments);

router
  .route('/comments/like/:commentId')
  .get(protect, controller.checkLikeComment);

module.exports = router;
