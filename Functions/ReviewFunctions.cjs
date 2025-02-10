const ReviewSchema = require('../Modules/ReviewModule.cjs')

const {catchAsyncError} = require("../utils/CatchAsyncError.cjs");

exports.createReview = catchAsyncError(async (req, res) => {

  const createdReview = await ReviewSchema.create(req.body)
  res.status(200).json({
    status: "Succeed",
    createdReview
  })
})

exports.getReviews = catchAsyncError(async (req, res) => {

  const reviews = await ReviewSchema.find({idProduct: req.params.id})

  res.status(200).json({
    status: "Succeed",
    length: reviews.length,
    reviews
  })
})