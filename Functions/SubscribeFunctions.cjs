const SubscribeSchema = require('../Modules/SubscribeModule.cjs')
const {catchAsyncError} = require("../utils/CatchAsyncError.cjs");


exports.addEmail = catchAsyncError(async (req, res) => {
   const {email} = req.body
console.log(req.body)
   try {
      const isSubscribed = await SubscribeSchema.findOne({email: email})
      if (isSubscribed) {
         res.status(500).json({
            status: "Failed",
            message: "You have already subscribed"
         })
      } else {
         await SubscribeSchema.updateOne({}, {$push: {email: email}})
         res.status(200).json({
            status: "Succeed",
            message: "Subscribed!"
         })
      }

   } catch (err) {
      res.status(500).json({
         status: "Failed",
         message: err
      })
   }
})
