const OrderProcessingSchema = require('../Modules/OrderProcessingModule.cjs')
const {catchAsyncError} = require("../utils/CatchAsyncError.cjs");
const cron = require('node-cron');
const {orderActivities} = require("../utils/orderActivities.cjs");

exports.createNewOrder = catchAsyncError(async (req, res) => {

  const {user} = req.body
  if (!user) {
    res.status(500).json({
      status: "Failed",
      message: "User id mast have"
    })
  } else {
    const createOrder = await OrderProcessingSchema.create(req.body)
    if (!createOrder) {
      res.status(500).json({
        status: "Failed",
        message: "Something went wrong",
        createOrder
      })
    }
    let i = 0;
    const task = cron.schedule('0 0 * * *', async () => {
      await OrderProcessingSchema.findById(createOrder._id, (err, order) => {
        if (err) console.log(err)
        const newStatus = orderActivities[i]
        order.orderActivity.push(newStatus)
        order.save(err => {
          if (err) console.log(err)
        });
        i++
        if (i >= orderActivities.length) {
          task.stop();
        }
      })
    })
    res.status(200).json({
      status: "Succeed",
      createOrder
    })
  }
})

exports.updatePayStatus = catchAsyncError(async (req, res) => {
  const {idOrderProcessing} = req.params
  if (!idOrderProcessing) {
    res.status(500).json({
      status: "Failed",
      message: "Id order mast have"
    })
  } else {
    const updateOrderStatus = await OrderProcessingSchema.findByIdAndUpdate(idOrderProcessing, {
      isPayed: true,
      cardDate: req.body.cardDate
    })
    res.status(200).json({
      status: "Succeed",
      updateOrderStatus
    })
  }
})


exports.getOrderProceessing = catchAsyncError(async (req, res) => {
  const {idOrderProcessing} = req.params

  if (idOrderProcessing) {
    const order = await OrderProcessingSchema.findOne({orderId: idOrderProcessing})
    if (order) {
      res.status(200).json({
        status: "Succeed",
        order
      })
    } else {
      res.status(500).json({
        status: "Not found",
        message: "Order by this id was not found"
      })
    }

  } else {
    res.status(500).json({
      status: "Failed",
      message: "idOrder needs to be in params"
    })
  }

})

exports.getOrdersByUserId = catchAsyncError(async (req, res) => {
  const {userId} = req.params
  if (userId) {
    const foundOrders = await OrderProcessingSchema.find({user: userId})
    if(foundOrders.length >= 1){
      res.status(200).json({
        status: "Succeed",
        foundOrders
      })
    }else{
      res.status(500).json({
        status:"Failed",
        message:"Orders were not found"

      })
    }

  } else {
    res.status(500).json({
      status: "Failed",
      message: "User id is required"
    })
  }

})
