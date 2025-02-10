const mongoose = require('mongoose')

const OrderSchema = new mongoose.Schema({
  idUser:{
    type:String,
    required:[true,'The idUser field must be fill']
  },
  products:[{
    idProduct:String,
    count:{
      type:Number,
      default:1
    },
    price:String | Number
  }]
})

const Order = mongoose.model('orders',OrderSchema)

module.exports = Order