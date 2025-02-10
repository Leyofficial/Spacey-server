const mongoose = require('mongoose')

const wishListSchema = new mongoose.Schema({

  idUser:{
    type:String,
    unique:true,
    required:[true,"The idUser must have"]
  },
  items:[String]
})

const WishList = mongoose.model('wishlists',wishListSchema)

module.exports = WishList
