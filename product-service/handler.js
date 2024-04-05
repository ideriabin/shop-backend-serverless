'use strict';

const { executeWithErrorHandler } = require('./helpers');
const getProductsList = require('./getProductsList');
const getProductsById = require('./getProductsById');

module.exports.getProductsList = () =>
  executeWithErrorHandler(() => getProductsList());

module.exports.getProductsById = (event) =>
  executeWithErrorHandler(() => getProductsById(event.pathParameters.productId));
