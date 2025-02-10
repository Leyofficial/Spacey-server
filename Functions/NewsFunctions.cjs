const News = require('./../Modules/NewsModule.cjs')
const {catchAsyncError} = require("../utils/CatchAsyncError.cjs");

exports.createNews = catchAsyncError(async (req, res) => {

  const createdNews = await News.create(req.body)

  res.status(200).json({
    status: "Succeed",
    createdNews
  })
})

exports.getAllNews = catchAsyncError(async (req, res) => {
  const news = await News.find()

  res.status(200).json({
    status: "Succeed",
    length: news.length,
    news
  })
})

exports.getSingleNews = catchAsyncError(async (req, res) => {

  const idNews = req.params.id
  const found = await News.findById(idNews)

  res.status(200).json({
    status: "Succeed",
    found
  })
})