const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb');
const { marshall } = require('@aws-sdk/util-dynamodb');
const uuid = require('uuid');

const client = new DynamoDBClient();

module.exports = async ({ title, description, price, count = 0 }) => {
  const id = uuid.v4();

  await client.send(new PutItemCommand({
    TableName: process.env.PRODUCTS_TABLE,
    Item: marshall({ id, title, description, price }),
  }));

  await client.send(new PutItemCommand({
    TableName: process.env.STOCK_TABLE,
    Item: marshall({ product_id: id, count }),
  }));

  return id;
};
