const express = require('express');
const controller = require('../controllers/comments.controller');
const { protect } = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(protect, controller.getCommentsByPostId)
  .post(protect, controller.createComment);

router
  .route('/:commentId')
  .put(protect, controller.updateComment)
  .delete(controller.removeComment);

module.exports = router;
