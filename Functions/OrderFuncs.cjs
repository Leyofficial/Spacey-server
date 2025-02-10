const OrderSchema = require('../Modules/OrderModules.cjs')
const {catchAsyncError} = require("../utils/CatchAsyncError.cjs");


exports.addOrderItem = catchAsyncError(async (req, res, next) => {
  const {idUser} = req.params
  const product = {idProduct: req.body.idProduct, count: req.body.count,price:req.body.price}
  const foundOrder = await OrderSchema.findOne({idUser: idUser})
  if (!foundOrder) {
    const newOrder = await OrderSchema.create({
      idUser: idUser,
      products: [product]
    })

    res.status(200).json({
      status: "Succeed",
      message: "Order was created",
      data: newOrder
    })
  } else {
   const addedItem = await OrderSchema.findOneAndUpdate(
      {idUser: idUser, 'products.idProduct': {$ne: req.body.idProduct}},
      {$push: {products: product}},
      {new: true}
    )

    if(addedItem) {
      res.status(200).json({
        status: "Succeed",
        message: "Product was added to your cart order",
      })
    }else{
      res.status(201).json({
        status:"Success",
        message:"This product is already in your cart"
      })
    }

  }
})


exports.getOrders = catchAsyncError(async (req, res) => {
  const {idUser} = req.params

  const foundOrders = await OrderSchema.findOne({idUser: idUser})

  res.status(200).json({
    status: "Succeed",
    foundOrders
  })

})

exports.deleteItemOrder = catchAsyncError(async (req, res) => {
  const {idUser} = req.params
  const {idItem} = req.body
  if (idUser && idItem) {
    const state = await OrderSchema.findOneAndUpdate({idUser: idUser}, {$pull: {products: {idProduct: idItem}}})

    res.status(200).json({
      status: "Succeed",
      message: "Item was deleted",
    })
  } else {
    res.status(500).json({
      status: "Failed",
      message: "Is not there required date"
    })
  }
})

exports.getOrderItem = catchAsyncError(async (req, res) => {
  const {idUser, idItem} = req.params

  const foundItem = await OrderSchema.findOne({idUser: idUser, "products.idProduct": idItem})
  if (foundItem) {
    res.status(200).json({
      status: "Succeed",
      isCart: true,
      foundItem
    })
  } else {
    res.status(200).json({
      status: "Succeed",
      isCart: false,
    })
  }
})

exports.deleteOrder = catchAsyncError(async (req,res) => {
  const {idOrder} = req.params
console.log(idOrder)
  const order = await OrderSchema.findByIdAndDelete(idOrder)
  res.status(200).json({
    status:"Succeed",
    message:"Order was deleted",
    order
  })
})
