const mongoose = require('mongoose')

const review = new mongoose.Schema({
  idAuthor: String,
  content: String,
  date: {
    type: String,
    default: new Date()
  },
  idProduct: String
})

const Review = mongoose.model('Reviews',review)

module.exports = Review