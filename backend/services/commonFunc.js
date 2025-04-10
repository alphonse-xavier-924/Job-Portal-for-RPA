const appendDateToFileName = (filePath) => {
  // Split the file path into its base name and extension
  const dotIndex = filePath.lastIndexOf('.');
  
  // Handle case when there's no extension
  if (dotIndex === -1) {
    return `${filePath}_${Date.now()}`;
  }

  const fileName = filePath.substring(0, dotIndex);
  const fileExtension = filePath.substring(dotIndex);

  // Append the current date to the file name
  const newFileName = `${fileName}_${Date.now()}${fileExtension}`;

  return newFileName;
};

module.exports = {
  appendDateToFileName
}
