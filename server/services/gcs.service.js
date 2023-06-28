const {Storage} = require('@google-cloud/storage');
const path = require('path')

const bucketName = 'instagram-clone-profile-images'


const storage = new Storage({
    keyFilename: path.join(__dirname,'../service-account-new.json')
});




async function upload(file) {
    const destFileName = file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    const contents = file.buffer
    const res = await storage.bucket(bucketName).file(destFileName).save(contents);
    return `https://storage.googleapis.com/${bucketName}/${destFileName}`

  }

  module.exports = {
    upload
  }