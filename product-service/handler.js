'use strict';

const { executeWithErrorHandler } = require('./helpers');
const getProductsList = require('./getProductsList');
const getProductsById = require('./getProductsById');
const createProduct = require('./createProduct');

exports.getProductsList = () =>
  executeWithErrorHandler(() => getProductsList());

exports.getProductsById = (event) =>
  executeWithErrorHandler(() => getProductsById(event.pathParameters));

exports.createProduct = (event) =>
  executeWithErrorHandler(() => createProduct(event.pathParameters));
