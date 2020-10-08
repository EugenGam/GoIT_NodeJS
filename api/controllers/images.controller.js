const multer = require("multer");
const path = require("path");
const { promises: fsPromises } = require("fs");
const { v4: uuidv4 } = require("uuid");
const imagemin = require("imagemin");
const imageminMozjpeg = require("imagemin-mozjpeg");
const imageminPngquant = require("imagemin-pngquant");
const config = require("../helpers/config");

const storage = multer.diskStorage({
  destination: "temp",
  filename: function (req, file, cb) {
    const filename = uuidv4();
    const ext = path.parse(file.originalname).ext;
    cb(null, filename + ext);
  },
});

async function minifyImage(req, res, next) {
  const { filename } = req.file;
  try {
    await imagemin([`temp/${filename}`], {
      destination: config.avatars,
      plugins: [
        imageminMozjpeg({ quality: 50 }),
        imageminPngquant({
          quality: [0.6, 0.8],
        }),
      ],
    });
    await fsPromises.unlink(req.file.path);
    req.file.path = path.join(config.avatars, filename);
    req.file.destination = config.avatars;
    next();
  } catch (err) {
    next(err);
  }
}

const upload = multer({ storage });

module.exports = { upload, minifyImage };
