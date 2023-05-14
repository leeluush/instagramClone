const router = require('express').Router();
const controller = require('../controllers/auth')
const verifyUser = require('../middleware/verify-user')


router.post('/api/login',controller.login)
router.post('/api/register', controller.register)
router.get('/api/user-info',  verifyUser,controller.getUserInfo)
router.post('/api/refresh-token',controller.refreshToken)






module.exports = router; 