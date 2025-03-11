
const multer = require('multer');

const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, "upload")
        },
        filename: function (req, file, callback) {
            callback(null, file.fieldname + "-" + Date.now() + ".jpg")
        }
    })
}).single("image")

module.exports = { upload }



