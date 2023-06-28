const express = require('express');
const router = express.Router();
const controller = require('./likes.controller');
const authMiddleware = require('../../middleware/authMiddleware')


router.get('/api/likes/likescount/:postId', controller.getLikesCountPost)
router.get('/api/likes/:commentId',controller.getLikesCountComments)
router.post('/api/likes/:postId',authMiddleware, controller.likePost);
router.delete('/api/likes/:postId',authMiddleware, controller.unlikePost);
router.get('/api/likes/like/:postId/:userId', controller.checkLikePost);


router.get('/api/likes/likescount/:commedId', controller.getLikesCountComments)
router.get('/api/likes/:postId',controller.getLikesCountPost)
router.post('/api/likes/:commedId', controller.likeComment);
router.delete('/api/likes/:commentId', controller.unlikeComment);
router.get('/api/likes/like/:commentId/:userId', controller.checkLikeComment);





module.exports = router;
