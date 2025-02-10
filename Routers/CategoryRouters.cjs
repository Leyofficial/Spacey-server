const express = require('express');

const categoryRouter = express.Router();
const categoryFunctions = require('./../Functions/Category.cjs')

categoryRouter.route('/')
  .get(categoryFunctions.getCategories)
  .post(categoryFunctions.createCategory)

categoryRouter.route('/product')
  .get(categoryFunctions.getProducts)


categoryRouter.route('/:id')
  .get(categoryFunctions.getProduct)
  .put(categoryFunctions.updateCategory)

module.exports = categoryRouter