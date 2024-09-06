const path = require("path");
const fs = require("fs");

const fileToObject = (filePath) => {
  const newFilePath = path.join(__dirname, filePath);
  return JSON.parse(fs.readFileSync(newFilePath).toString());
};

const objectToFile = (fileData) => {
  fs.writeFileSync(
    path.join(__dirname, "./data.json"),
    JSON.stringify(fileData, null, 2)
  );
};

module.exports = {
  fileToObject,
  objectToFile,
};
