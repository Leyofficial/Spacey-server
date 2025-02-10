const mongoose = require('mongoose')

const subscribeSchema = new mongoose.Schema({

   email:[String]
})





const Subscribe = mongoose.model('subscribe', subscribeSchema)
module.exports = Subscribe;