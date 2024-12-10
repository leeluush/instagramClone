const router = require('express').Router();

const authController = require('../controllers/authController');
const userController = require('../controllers/usersControllers');
const { uploadProfileImage } = require('../middleware/upload');

router
  .route('/signup')
  .post(uploadProfileImage.single('profileImage'), authController.signUp);

router.route('/login').post(authController.login);
router.route('/forgotPassword').post(authController.forgotPassword);
router.route('/resetPassword/:token').patch(authController.resetPassword);

router
  .route('/updateMe')
  .patch(authController.protect, userController.updateMe);

router
  .route('/suggested-users')
  .get(authController.protect, userController.getSuggestedUsers);

// For logout
router.route('/logout').post(authController.protect, authController.logOutUser);

// For user profile
router
  .route('/userprofile')
  .get(authController.protect, userController.getUserProfile);

// For refreshing token
router.route('/refresh-token').post(authController.refreshToken);

module.exports = router;
