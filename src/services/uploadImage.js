const cloudinary = require("../config/cloudinary");

async function uploadImage(file) {
    if (!file || !file.buffer) {
        throw new Error("Empty file");
    }
    return new Promise((resolve, reject) => {
        cloudinary.uploader
            .upload_stream({ resource_type: "image" }, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result.secure_url);
                }
            })
            .end(file.buffer);
    });
}

module.exports = uploadImage;
