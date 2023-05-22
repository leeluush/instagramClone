const router = require('express').Router();
const postsRouter = require('./post.routes');
const categoriesRouter = require('./categories.routes');
const authRouter = require('./auth');
const commentsRouter = require ('./comments.routes')

router.use(commentsRouter)
router.use(postsRouter);
router.use(categoriesRouter);
router.use(authRouter);


module.exports = router;
