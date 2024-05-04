'use strict';

const { S3Client, GetObjectCommand, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const csv = require('csv-parser');

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


exports.importFileParser = async (event) => {
  console.log(JSON.stringify(event));

  for await (const r of event.Records) {
    const { bucket: { name }, object: { key } } = r.s3;
    console.log({ name, key });

    const object = await s3.send(new GetObjectCommand({
      Bucket: name,
      Key: key,
    }));

    object.Body.pipe(csv()).on('data', data => console.log(data));
  }
};
