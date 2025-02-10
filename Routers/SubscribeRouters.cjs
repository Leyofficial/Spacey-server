const express = require('express')

const subscribeRouter = express.Router();
const subscribeFunction = require('../Functions/SubscribeFunctions.cjs')

subscribeRouter.route('/')
   .post(subscribeFunction.addEmail)

module.exports = subscribeRouter