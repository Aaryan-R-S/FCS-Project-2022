const crypto = require('crypto');
const path = require("path");
const multer = require("multer");

// Returns a new random hex string of the given even size.
function randomFileName(size) {
    if (size === 0) {
        throw new Error("Zero-length randomHexString is useless.");
    }

    if (size % 2 !== 0) {
        throw new Error("randomHexString size must be divisible by 2.");
    }

    return (0, crypto.randomBytes)(size / 2).toString("hex");
}

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/');
    },
    // By default, multer removes file extensions so let's add them back
    filename: function(req, file, cb) {
        let filename = req.body.healthid + randomFileName(32) + Date.now() ;      
        cb(null, filename + path.extname(file.originalname));
    }
});

const multerFilter = function(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|pdf|PDF|txt|TXT|doc|DOC|docx|DOCX)$/)) {
        req.fileValidationError = 'Only .jpg/.jpeg/.png/pdf/.txt/.doc/.docx files are allowed!';
        req.file = undefined;
        return cb(null, false);
    }
    cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: multerFilter, limits: {fileSize: 1024 * 1024} }).single('file');

module.exports = upload;
