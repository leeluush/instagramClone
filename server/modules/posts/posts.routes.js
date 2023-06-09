const router = require('express').Router(); 
const controller = require('./posts.controller')
const authMiddleware = require("../../middleware/authMiddleware");
const multer = require('multer');

const upload = multer ({dest: 'upload/'})

router.get('/api/posts', controller.getPosts);
router.get('/api/posts/:postId', controller.getPostById);
router.post('/api/posts', controller.createPost)
router.put('/api/posts/:postId', controller.updatePost);
router.delete('/api/posts/:postId', controller.removePost);


module.exports = router; 
 