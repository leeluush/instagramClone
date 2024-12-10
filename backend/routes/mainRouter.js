const router = require('express').Router();

const feedController = require('../controllers/feedController');
const { protect } = require('../controllers/authController');

router.route('/api/feed').get(protect, feedController.getFeed);

const postsRouter = require('./postRoutes');
const usersRouter = require('./usersRoutes');
const followersRouter = require('./followersRoutes');
const likesRouter = require('./likesRoutes');

router.use('/api/posts', postsRouter);
router.use('/api/users', usersRouter);
router.use('/api/followers', followersRouter);
router.use('/api/likes', likesRouter);

module.exports = router;
