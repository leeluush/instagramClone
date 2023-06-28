const router = require('express').Router();
const controller = require('./users.conrtoller')
const authMiddleware = require('../../middleware/authMiddleware')


const upload = require('../../middleware/upload');


router.post('/api/users/login',controller.login)
router.post('/api/register',upload.single('profileImage'), controller.registerUser)
router.post('/api/users/logout',controller.logOutUser)
router.get('/api/users/userprofile',authMiddleware, controller.getUserProfile)
router.post('/api/users/refresh-token',authMiddleware, controller.refreshToken)








module.exports = router; 