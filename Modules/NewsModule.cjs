const mongoose = require('mongoose')

const newsModule = new mongoose.Schema({
  author: String,
  date: {
    type: String,
    default: new Date()
  },
  reviews: [{
    review: String,
    reviewAuthor: String,
    dateOfReview: {
      type: String,
      default: new Date()
    }
  }],
  title: String,
  description: String,
  subtitle: String,
  image: String
})

const News = mongoose.model('News', newsModule)

module.exports = News