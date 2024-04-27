'use strict';

const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3 = new S3Client();

exports.importProductsFile = async (event) => {
  console.log({ event });

  const { BUCKET_NAME, UPLOAD_DIR } = process.env;
  const { name } = event.queryStringParameters;

  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: `${UPLOAD_DIR}/${name}`,
    });

    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });

    return {
      statusCode: 200,
      body: signedUrl,
    };
  } catch (err) {
    console.error(err);
  }
};
