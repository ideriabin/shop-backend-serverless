const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb');
const { marshall } = require('@aws-sdk/util-dynamodb');
const { SNSClient, PublishCommand } = require('@aws-sdk/client-sns');

const dynamo = new DynamoDBClient();
const sns = new SNSClient();

module.exports = async (records = []) => {
  console.log('Products to create', records);

  for (const record of records) {
    try {
      const { id, title, description, price, count } = JSON.parse(record.body);

      await dynamo.send(new PutItemCommand({
        TableName: process.env.PRODUCTS_TABLE,
        Item: marshall({ id, title, description, price }),
      }));

      await dynamo.send(new PutItemCommand({
        TableName: process.env.STOCK_TABLE,
        Item: marshall({ product_id: id, count }),
      }));

      await sns.send(new PublishCommand({
        TopicArn: process.env.CREATE_PRODUCT_TOPIC_ARN,
        Message: `New product created:\n\n${record.body}`,
      }));

      console.log('Product created', { id, title, description, price, count });
    } catch (err) {
      console.error(err);
    }
  }
};
