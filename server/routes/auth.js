const router = require('express').Router();
const controller = require('../controllers/auth.conrtollers')
const authMiddleware = require('../middleware/authMiddleware')


const upload = require('../middleware/upload');


router.post('/api/users/login',controller.login)
router.post('/api/users/register',upload.single('profileImage'), controller.registerUser)
router.post('/api/users/logout',controller.logOutUser)
router.get('/api/users/userprofile', authMiddleware, controller.getUserByUserId)
router.post('/api/users/refresh-token',authMiddleware, controller.refreshToken)








module.exports = router; 