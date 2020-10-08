var imgGen = require("js-image-generator");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const config = require("../helpers/config");

function geterateAvatar() {
  const filename = uuidv4();
  const destenition = `${config.temp}${filename}.jpeg`;
  const filePath = `${config.avatars}/${filename}.jpeg`;
  imgGen.generateImage(100, 100, 80, function callback(err, image) {
    fs.writeFileSync(destenition, image.data);
  });
  const tempFile = fs.createReadStream(destenition);
  const imageFile = fs.createWriteStream(filePath);
  tempFile.pipe(imageFile);
  console.log(destenition, filePath);
  return { destenition, filePath };
}

module.exports = geterateAvatar;
