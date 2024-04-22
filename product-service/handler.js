'use strict';

const { executeWithErrorHandler } = require('./helpers');
const getProductsList = require('./getProductsList');
const getProductsById = require('./getProductsById');
const createProduct = require('./createProduct');

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
  return executeWithErrorHandler(() => createProduct(event.pathParameters));
};
