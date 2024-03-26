const { products } = require('./mocks');

module.exports = (productId) => {
  const product = products.find(p => p.id === productId);
  if (!product) throw new Error('Product not found');
  return Promise.resolve(product);
};
