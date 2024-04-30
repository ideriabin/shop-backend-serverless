const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb');
const { marshall } = require('@aws-sdk/util-dynamodb');

const client = new DynamoDBClient();

module.exports = async (records = []) => {
  console.log('Products to create', records);

  for (const record of records) {
    try {
      const { id, title, description, price, count } = JSON.parse(record.body);

      await client.send(new PutItemCommand({
        TableName: process.env.PRODUCTS_TABLE,
        Item: marshall({ id, title, description, price }),
      }));

      await client.send(new PutItemCommand({
        TableName: process.env.STOCK_TABLE,
        Item: marshall({ product_id: id, count }),
      }));

      console.log('Product created', { id, title, description, price, count });
    } catch (err) {
      console.error(err);
    }
  }
};
