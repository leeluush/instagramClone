const router = require('express').Router(); 
const controller = require('./comments.controller');
const authMiddleware = require('../../middleware/authMiddleware.js');


router.get('/api/posts/:postId/comments',controller.getCommentsByPostId)
router.post('/api/comments', authMiddleware, controller.createComment)
router.put('/api/comments/:commentsId', authMiddleware, controller.updateComment);
router.delete('/api/comments/:commentId', authMiddleware,controller.removeComment);

module.exports = router

