const express = require('express')

const imagesRouter = express.Router();
const imagesFunctions = require('./../Functions/Images.cjs')
const {upload} = require("../Functions/Images.cjs");

imagesRouter.route('/:id?')
.get(imagesFunctions.getFile)
.post(upload.single('file'),(req,res) => {
  console.log(req.file)
  res.status(200).json({
    status: 'Succeed',
    file: req.file
  })
})

module.exports = imagesRouter