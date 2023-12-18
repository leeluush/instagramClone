const multer = require('multer');
const MulterGoogleStorage = require('multer-google-storage');
const path = require('path');

// Determine the keyFilename based on the environment
const keyFilename =
  process.env.NODE_ENV === 'production'
    ? '/etc/secrets/key-service.json' // Path in production on Render.com
    : './key-service.json'; // Local path in development

const uploadProfileImage = multer({
  storage: MulterGoogleStorage.storageEngine({
    projectId: 'feisty-oxide-390906',
    keyFilename: keyFilename,
    bucket: 'instagram-clone-profile-images',
    filename: function (req, file, cb) {
      cb(
        null,
        file.fieldname + '-' + Date.now() + path.extname(file.originalname),
      );
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

const uploadPost = multer({
  storage: MulterGoogleStorage.storageEngine({
    projectId: 'feisty-oxide-390906',
    keyFilename: keyFilename,
    bucket: 'instagram-clone-post-media',
    filename: function (req, file, cb) {
      cb(
        null,
        file.fieldname + '-' + Date.now() + path.extname(file.originalname),
      );
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = { uploadProfileImage, uploadPost };
