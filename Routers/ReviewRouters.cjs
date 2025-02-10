const express = require('express')

const reviewRouter = express.Router();
const reviewFunctions = require('../Functions/ReviewFunctions.cjs')
reviewRouter.route('/:id?')
  .get(reviewFunctions.getReviews)
  .post(reviewFunctions.createReview)

module.exports = reviewRouter