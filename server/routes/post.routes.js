const router = require('express').Router(); 
const controller = require('../controllers/posts.controllers')
const verifyUser = require("../middleware/verify-user");
const multer = require('multer');

const upload = multer ({dest: 'upload/'})

router.get('/api/posts', verifyUser, controller.getPosts);
router.get('/api/posts/:postId', verifyUser, controller.getSinglePost);
router.post('/api/posts', verifyUser, controller.createPost)
router.put('/api/posts/:postId', verifyUser, controller.updatePost);
router.delete('/api/posts/:postId', verifyUser, controller.removePost);


module.exports = router; 
