const router = require('express').Router();

const postController = require('../controllers/postController');
const { protect } = require('../controllers/authController');
const commentsRouter = require('./commentsRoutes');

const { uploadPost } = require('../middleware/upload');

router
  .route('/')
  .get(postController.getPosts)
  .post(protect, uploadPost.single('media'), postController.createPost);

router
  .route('/:postId')
  .get(postController.getPostById)
  .patch(protect, uploadPost.single('media'), postController.updatePost)
  .delete(protect, postController.removePost);

router.use('/:postId/comments', commentsRouter);

module.exports = router;
