const router = require('express').Router();
const controller = require('../controllers/auth')
const verifyUser = require('../middleware/verify-user')
const upload = require('../middleware/upload');


router.post('/api/login',controller.login)
router.post('/api/register',upload.single('profileImage'), controller.register)
router.post('/api/logout',verifyUser, controller.logout)
router.get('/api/user-info',  verifyUser,controller.getUserInfo)
router.post('/api/refresh-token',controller.refreshToken)
router.get('/api/users',controller.getUserByUserId);







module.exports = router; 