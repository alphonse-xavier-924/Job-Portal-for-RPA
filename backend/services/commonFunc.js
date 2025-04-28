const appendDateToFileName = (filePath) => {
  const dotIndex = filePath.lastIndexOf(".");

  if (dotIndex === -1) {
    return `${filePath}_${Date.now()}`;
  }

  const fileName = filePath.substring(0, dotIndex);
  const fileExtension = filePath.substring(dotIndex);

  const newFileName = `${fileName}_${Date.now()}${fileExtension}`;

  return newFileName;
};

module.exports = {
  appendDateToFileName,
};
