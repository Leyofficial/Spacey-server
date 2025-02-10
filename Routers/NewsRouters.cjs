const express = require('express')
const newsFunctions =  require('./../Functions/NewsFunctions.cjs')
const newsRouter = express.Router()

newsRouter.route('/')
.get(newsFunctions.getAllNews)
.post(newsFunctions.createNews)

newsRouter.route('/new/:id')
  .get(newsFunctions.getSingleNews)

module.exports = newsRouter