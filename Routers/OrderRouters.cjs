const express = require('express')

const orderRouter = express.Router()
const orderFunctions = require('../Functions/OrderFuncs.cjs')
orderRouter.route('/:idUser')
  .post(orderFunctions.addOrderItem)
  .get(orderFunctions.getOrders)
  .patch(orderFunctions.deleteItemOrder)
orderRouter.route('/cart/:idUser/:idItem')
  .get(orderFunctions.getOrderItem)

orderRouter.route('/delete/:idOrder')
  .post(orderFunctions.deleteOrder)

module.exports = orderRouter