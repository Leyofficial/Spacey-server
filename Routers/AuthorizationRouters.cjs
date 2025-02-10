const express = require('express')

const authRouter = express.Router()

const authFunc = require('../Functions/AuthorizationFuncs.cjs')

authRouter.route('/')
  .post(authFunc.createUser)
  .get(authFunc.login)

authRouter.route('/resetPassword')
  .post(authFunc.forgotPassword)

authRouter.route('/updatePassword/:idUser')
  .post(authFunc.updatePassword)
authRouter.route('/confirmEmail')
  .post(authFunc.sendConfirmCode)
  .patch(authFunc.acceptConfirmCode)
authRouter.route('/find/:randomCode')
  .get(authFunc.getUserByRandoCode)

authRouter.route('/google')
  .post(authFunc.googleSingUp)
  .get(authFunc.googleLogin)

authRouter.route('/token/:token')
  .get(authFunc.getUser)

authRouter.route('/card/add/:idUser')
  .patch(authFunc.addCard)
authRouter.route('/card/delete/:idUser')
  .patch(authFunc.deleteCard)

authRouter.route('/card/edit/:idUser')
  .post(authFunc.editCard)
  .patch(authFunc.editUser)

authRouter.route('/user/edit/:idUser')
  .post(authFunc.editUser)
  .patch(authFunc.setAvatar)

// authRouter.route('/google')


module.exports = authRouter