const router = require('express').Router();

const postsRouter = require('./modules/posts/posts.routes');
const usersRouter = require('./modules/users/users.routes');
const commentsRouter = require ('./modules/comments/comments.routes')
const followersRouter = require ('./modules/followers/followers.routes')
const likesRouter = require ('./modules/likes/likes.routes');

router.use(commentsRouter)
router.use(postsRouter);
router.use(usersRouter);
router.use(followersRouter);
router.use(likesRouter);


module.exports = router;
