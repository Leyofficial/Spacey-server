const express = require('express')

const orderProcessingRouter = express.Router()
const orderProcessingFunc = require('../Functions/OrderProcessingFunc.cjs')

orderProcessingRouter.route('/:idOrderProcessing?')
  .get(orderProcessingFunc.getOrderProceessing)
  .patch(orderProcessingFunc.updatePayStatus)
orderProcessingRouter.route('/')
  .post(orderProcessingFunc.createNewOrder)

// orderProcessingRouter.route('/order/:idOrder')
//   .get(orderProcessingFunc.getOrderProceessing)

orderProcessingRouter.route('/user/:userId')
  .get(orderProcessingFunc.getOrdersByUserId)

module.exports = orderProcessingRouter