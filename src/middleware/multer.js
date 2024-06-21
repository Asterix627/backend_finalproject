const multer = require("multer");
// const { CloudinaryStorage } = require("multer-storage-cloudinary");
// const cloudinary = require("../config/cloudinary");

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

module.exports = upload;
