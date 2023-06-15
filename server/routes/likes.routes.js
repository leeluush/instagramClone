const express = require('express');
const router = express.Router();
const controller = require('../controllers/likes.controllers');
const authMiddleware = require('../middleware/authMiddleware')


router.get('/api/likes/likescount/:postId', controller.getLikesCount)
router.post('/api/likes/:postId', controller.like);
router.delete('/api/likes/:postId', controller.unlike);
router.get('/api/likes/like/:postId/:userId', controller.checkLike);




module.exports = router;
