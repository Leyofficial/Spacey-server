const Wish = require('../Modules/WishListModule.cjs')
const {catchAsyncError} = require("../utils/CatchAsyncError.cjs");

exports.addWishItem = catchAsyncError(async (req, res) => {
  const {idUser} = req.params
  const item = req.body.item
  if (idUser && req.body.item) {
    let wishList = await Wish.findOne({idUser: idUser})

    if (!wishList) {
      wishList = await Wish.create({idUser: idUser, items: [item]})
      res.status(200).json({
        status: "Succeed",
        message: "Wish list was created and saved an item"
      })
    } else {
      if (!wishList.items.includes(item)) {
        wishList.items.push(item)
        await wishList.save()
        res.status(200).json({
          status: "Succeed",
          message: "Item was saved"
        })
      } else {
        res.status(200).json({
          status: "Succeed",
          message: "Item already exists in the wish list"
        })
      }
    }
  }else{
    res.status(500).json({
      status:"Failed",
      message:"isUser and item are required"
    })
  }

})


exports.getWishItems = catchAsyncError(async (req, res) => {
  const {idUser} = req.params
  if (idUser) {
    const foundItems = await Wish.findOne({idUser: idUser})

    res.status(200).json({
      status: "Succeed",
      foundItems
    })
  } else {
    res.status(500).json({
      status: "Failed",
      message: "idUser is required"
    })
  }

})

exports.deleteItem = catchAsyncError(async (req, res) => {
  const {idUser, idItem} = req.body
  if (idUser && idItem) {
    await Wish.findOneAndUpdate({idUser: idUser}, {$pull: {items: idItem}})

    res.status(200).json({
      status: "Succeed",
      message: "Item was deleted"
    })
  } else {
    res.status(500).json({
      status: "Failed",
      message: "idUser and idItem is required"
    })
  }

})