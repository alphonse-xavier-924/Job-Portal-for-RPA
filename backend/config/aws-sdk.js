require('module-alias/register');
require('dotenv').config();
const { Upload } =  require("@aws-sdk/lib-storage");
const { S3Client, S3 } = require("@aws-sdk/client-s3");
const fs = require('fs');

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY,
    secretAccessKey: process.env.AWS_S3_SECRET
  }
});

module.exports = {
  async uploadToBucket(req, path){
    try {
      const parallelUploads3 = new Upload({
        client: s3,
        params: { 
          Bucket: process.env.AWS_S3_BUCKET_NAME, 
          ACL: "public-read",
          Key: path, 
          Body: fs.createReadStream(req.file.path),
          mimetype: req.file.mimetype
        },
        queueSize: 4, // optional concurrency configuration
        partSize: 1024 * 1024 * 5, // optional size of each part, in bytes, at least 5MB
        leavePartsOnError: false, // optional manually handle dropped parts
      });

      const obj = await parallelUploads3.done();
      return { status: 1, file: obj };

    } catch (e) {
      return { status: 0, file: e };

    }
  }
}
