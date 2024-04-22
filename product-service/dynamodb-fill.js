const { DynamoDBClient, PutItemCommand, DescribeTableCommand } = require('@aws-sdk/client-dynamodb');
const { products } = require('./mocks');

(async () => {
  const client = new DynamoDBClient({ region: 'eu-central-1' });

  products.forEach(async product => {
    try {
      await client.send(
        new PutItemCommand({
          TableName: 'products',
          Item: {
            id: { S: product.id },
            title: { S: product.title },
            description: { S: product.description || null, NULL: true },
            price: { N: product.price.toString() },
          },
        })
      );

      await client.send(
        new PutItemCommand({
          TableName: 'stock',
          Item: {
            product_id: { S: product.id },
            count: { N: Math.round(Math.random() * 10).toString() }
          },
        })
      );
    } catch (err) {
      console.error(err);
    }
  });

  try {
    console.log(await client.send(new DescribeTableCommand({ TableName: 'products' })));
    console.log(await client.send(new DescribeTableCommand({ TableName: 'stock' })));
  } catch (err) {
    console.error(err);
  }
})();
