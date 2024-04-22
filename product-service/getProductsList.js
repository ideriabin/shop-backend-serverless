const { DynamoDBClient, ScanCommand } = require('@aws-sdk/client-dynamodb');
const { unmarshall } = require('@aws-sdk/util-dynamodb');

const client = new DynamoDBClient();

module.exports = async () => {
  const products = await client.send(new ScanCommand({ TableName: process.env.PRODUCTS_TABLE }));
  const stock = await client.send(new ScanCommand({ TableName: process.env.STOCK_TABLE }));
  return products.Items.map(item => ({
    ...unmarshall(item),
    count: stock.Items.find(s => s.product_id.S === item.id.S).count.N,
  }));
};
