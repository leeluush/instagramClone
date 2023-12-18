const router = require('express').Router();

const authController = require('../controllers/authController');
const userController = require('../controllers/usersControllers');
const { uploadProfileImage } = require('../middleware/upload');

router
  .route('/signup')
  .post(uploadProfileImage.single('profileImage'), authController.signUp);

router.route('/login').post(authController.login);

// For logout
router.route('/logout').post(authController.logOutUser);

// For user profile
router
  .route('/userprofile')
  .get(authController.protect, userController.getUserProfile);

// For refreshing token
router.route('/refresh-token').post(authController.refreshToken);

module.exports = router;
