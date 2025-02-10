const mongoose = require('mongoose')


const category = new mongoose.Schema({
  categoryOfProduct: {
    type: String,
    required: [true, 'Type of product must have'],
  },
  brand: {
    type: String,
    required: [true, 'Brand of the product must have']
  },
  product: {
    title: String,
    images: {
      mainImage:String,
      restImages:[{
        color:String,
        images:[String]
      }],
    },
    price: Number | String,
    rating: Number,
    sale:Boolean,
    percentageOfSale:Number,
    size:[String],
    bestSellers:Boolean,
    stateType:String,
    memory:[String],
    storage:[String],
    description:String,
    flashSale:Boolean,
    status:{
      type:String,
      default:'New',
    },
    tag:String
  },
  isStock:Boolean
})
const Category = mongoose.model('categories',category);

module.exports = Category
