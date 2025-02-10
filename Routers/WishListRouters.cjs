const express = require('express')

const wishItemRouter = express.Router();

const wishFunctions = require('../Functions/WishListFuncs.cjs')

wishItemRouter.route('/:idUser')
  .get(wishFunctions.getWishItems)
  .post(wishFunctions.addWishItem)

wishItemRouter.route('/')
  .patch(wishFunctions.deleteItem)

module.exports = wishItemRouter