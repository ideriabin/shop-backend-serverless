'use strict';

const { S3Client, GetObjectCommand, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { SQSClient, SendMessageCommand } = require('@aws-sdk/client-sqs');
const csv = require('csv-parser');

const s3 = new S3Client();
const sqs = new SQSClient();

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

  try {
    for (const record of event.Records) {
      const { bucket: { name }, object: { key } } = record.s3;
      console.log({ name, key });

      const object = await s3.send(new GetObjectCommand({
        Bucket: name,
        Key: key,
      }));

      for await (const data of object.Body.pipe(csv())) {
        console.log(data);
        await sqs.send(new SendMessageCommand({
          QueueUrl: process.env.QUEUE_URL,
          MessageBody: JSON.stringify(data),
        }))
      }
    }
  } catch (err) {
    console.log(err);
  }
};
