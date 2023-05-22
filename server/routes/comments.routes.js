const router = require('express').Router(); 
const controller = require('../controllers/comments.controllers.js')
const verifyUser = require("../middleware/verify-user");


router.get('/api/comments', controller.getCommentsByPostId);
router.post('/api/comments',  controller.createComment)
router.put('/api/comments/:commentsId',  controller.updateComment);
router.delete('/api/comments/:commentsId', controller.removeComment);

module.exports = router;