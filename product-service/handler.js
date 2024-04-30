'use strict';

const { executeWithErrorHandler } = require('./helpers');
const getProductsList = require('./getProductsList');
const getProductsById = require('./getProductsById');
const createProduct = require('./createProduct');
const catalogBatchProcess = require('./catalogBatchProcess');

exports.getProductsList = (event, context) => {
  console.log('getProductsList', event, context);
  return executeWithErrorHandler(() => getProductsList());
};

exports.getProductsById = (event, context) => {
  console.log('getProductsById', event, context);
  return executeWithErrorHandler(() => getProductsById(event.pathParameters));
};

exports.createProduct = (event, context) => {
  console.log('createProduct', event, context);
  return executeWithErrorHandler(() => createProduct(JSON.parse(event.body)));
};

exports.catalogBatchProcess = (event, context) => {
  console.log('catalogBatchProcess', event, context);
  return executeWithErrorHandler(() => catalogBatchProcess(event.Records));
};
