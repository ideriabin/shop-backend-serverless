const { DynamoDBClient, GetItemCommand } = require('@aws-sdk/client-dynamodb');
const { unmarshall } = require('@aws-sdk/util-dynamodb');

const client = new DynamoDBClient();

module.exports = async ({ productId }) => {
  const product = await client.send(
    new GetItemCommand({ TableName: process.env.PRODUCTS_TABLE, Key: { id: { S: productId } } })
  );
  const stock = await client.send(
    new GetItemCommand({ TableName: process.env.STOCK_TABLE, Key: { product_id: { S: productId } } })
  );
  if (!product.Item || !stock.Item) throw new Error('Product not found');
  return Promise.resolve({ ...unmarshall(product.Item), count: stock.Item.count.N });
};
