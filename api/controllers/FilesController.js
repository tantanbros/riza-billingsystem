const fs = require("fs");

exports.getFile = (req, res, next) => {
  const filePath = `${process.env.UPLOADS_DIRECTORY}/${req.params.fileName}`;
  if (fs.existsSync(filePath)) {
    return res.status(200).sendFile(filePath);
  }

  return res.status(404);
};
