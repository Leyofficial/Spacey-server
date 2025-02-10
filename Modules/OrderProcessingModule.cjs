const mongoose = require('mongoose')
const cron = require('node-cron');

function defaultOrderActivity() {
  return [
    {
      activity: 'pending',
      date: new Date(),
      isReady: true,
      text: "Order in the Confirmation Process"
    },
  ];
}
const OrderProcessingSchema = new mongoose.Schema({
  paymentType: String,
  date: String,
  dataBilling: {
    userName: {
      firstName: String,
      lastName: String,
      companyName: String
    },
    address: {
      street: String,
      country: String,
      region: String,
      city: String,
      zipCode: Number | String,
    },
    email: String,
    phone: String | Number,
    orderNotes: String,
  },
  products: [{
    count: Number,
    idProduct: String,
    price: Number,
    _id: String
  }],
  user: String,
  isPayed:{
    type:Boolean,
    default:false
  },
  cardDate:{
    number:Number | String,
    expiry:String,
    cvc:Number  | String,
    name:String
  },
  orderActivity:{
    type:[{
      activity:{
        type:String,
        default:'pending'
      },
      date:{
        type:String,
        default:new Date()
      },
      isReady:{
        type:Boolean,
        default: true
      },
      text:{
        type:String,
        default:"Order in the Confirmation Process"
      }
    }],
    default:defaultOrderActivity
  },
  orderId:String
})

const OrderProcessing = mongoose.model('orderProcessing',OrderProcessingSchema)
module.exports = OrderProcessing
