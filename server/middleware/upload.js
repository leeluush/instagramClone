const multer = require('multer');
const MulterGoogleStorage = require('multer-google-storage');
const path = require('path'); 

const uploadHandler = multer ({
    storage: MulterGoogleStorage.storageEngine({
        projectId: "feisty-oxide-390906",
        keyFilename: path.join(__dirname, '../service-account.json'),
        bucket:"instagram-clone-profile-images",
        filename: function(req, file, cb) {
            cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
        }
    })
});

const multerMid = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})
  

module.exports = multerMid;
