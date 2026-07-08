const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
console.log(CloudinaryStorage);

cloudinary.config({
    cloud_name : process.env.CLOUD_NAME,
    api_key : process.env.CLOUD_API_KEY,
    api_secret : process.env.CLOUD_API_SECRET_KEY,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'wonderlust_DEV',
    allowedFormats: ["png", "jpg", "jpeg"] // supports promises as well
  },
});

module.exports = {
    cloudinary,
    storage,
}