const Category = require('./../Modules/Categories.cjs');
const {catchAsyncError} = require("../utils/CatchAsyncError.cjs");
const {toTitleCase} = require("../utils/toTitleCase.cjs");


exports.createCategory = catchAsyncError(async (req, res) => {

  const createdCategory = await Category.create(req.body)
  res.status(200).json({
    status: "Succeed",
    createdCategory
  })
})

exports.getCategories = catchAsyncError(async (req, res) => {

  const categories = await Category.find()
  res.status(200).json({
    status: "Succeed",
    length:categories.length,
    categories
  })
})


exports.getProducts = catchAsyncError(async (req,res) => {

  let filter = {}
  if (req.query.category) {
    filter.categoryOfProduct = { $in: toTitleCase(req.query.category) }
  }

  if (req.query.brand) {
    filter.brand = {$in: toTitleCase(req.query.brand)}
  }

  if (req.query.name) {
    filter["product.title"] = toTitleCase(req.query.name)
  }
  if (req.query.minPrice && req.query.maxPrice) {
    filter["product.price"] = { $gte: Number(req.query.minPrice), $lte: Number(req.query.maxPrice) }
  }
  if(req.query.minPrice){
    filter["product.price"] = { $gte: Number(req.query.minPrice) }
  }
  if(req.query.maxPrice){
    filter["product.price"] = { $gte: Number(req.query.maxPrice) }
  }
  if(req.query.status) {
    filter["product.status"] = {$in:req.query.status}
  }
  if(req.query.flashSale){
    filter["product.flashSale"] = {$in:true}
  }
  if(req.query.bestSellers) {
    filter["product.bestSellers"] = {$in:true}
  }
  if(req.query.rating) {
    filter["product.rating"] = {$in:req.query.rating}
  }
  if(req.query.stateType) {
    filter["product.stateType"] = {$in:req.query.stateType}
  }
  if(req.query.tag) {
    filter["product.tag"] = {$in:req.query.tag}
  }
  const foundProduct = await Category.find(filter)
  res.status(200).json({
    status:"Succeed",
    length:foundProduct.length,
    foundProduct
  })
})

exports.getProduct = catchAsyncError(async (req,res) => {
  const id = req.params.id

  const found = await Category.findById(id)

  res.status(200).json({
    status:"Succeed",
    found
  })
})

exports.updateCategory = catchAsyncError(async (req,res) => {

  const id = req.params.id

  let categoryToChange = await Category.findById(id)
  console.log(categoryToChange)

  if(categoryToChange?.product.images.restImages && typeof categoryToChange.product.images.restImages === 'object' && !Array.isArray(categoryToChange.product.images.restImages)){
    categoryToChange.product.images.restImages = Object.values(categoryToChange.product.images.restImages);
    categoryToChange.product.images.restImages.push(req.body)
  }

  categoryToChange = await categoryToChange.save()

  res.status(200).json({
    status:"Succeed",
    categoryToChange
  })
})