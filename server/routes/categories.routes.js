const router = require('express').Router();
const controller = require('../controllers/auth')


router.post('/api/login', controller.login)
router.post('/api/register', controller.register)
router.get('/api/user-info', controller.getUserInfo)
router.post('/api/refresh-token', controller.refreshToken)


module.exports = router;