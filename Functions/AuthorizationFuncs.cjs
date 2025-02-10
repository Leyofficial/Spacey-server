const {catchAsyncError} = require("../utils/CatchAsyncError.cjs");
const Auth = require("../Modules/AuthorizationModule.cjs");
const {createToken} = require("./CreateToken.cjs");
const ErrorHandler = require("../utils/ErrorHandler.cjs");
const {sendEmail, sendConfirmEmail} = require("../email/email.cjs");


exports.createUser = catchAsyncError(async (req, res) => {
  const isAccountExist = await Auth.findOne({email: req.body.email})
  if (isAccountExist && isAccountExist.isGoogleAccount) {
    res.status(500).json({
      status: "Error",
      message: "You have already registered Google account under this email,use Google to login"
    })
  } else if (isAccountExist) {
    res.status(500).json({
      status: "Error",
      message: "This email has already been taken. Please use another email or log in to your account"
    })
  } else {
    try {
      const newUser = await Auth.create(req.body)
      // newUser.hashPassword()
      const newToken = await createToken()
      newUser.hashPassword()
      newUser.saveToken(newToken)
      res.status(200).json({
        status: "Succeed",
        newUser
      })
    } catch (err) {
      res.status(500).json({
        status: "Failed",
        err
      })
      console.log(err)
    }

  }

})

exports.login = catchAsyncError(async (req, res, next) => {
  const {email, password} = req.query
  const isAccountExist = await Auth.findOne({email: email})

  if (isAccountExist && isAccountExist.isGoogleAccount) {
    res.status(500).json({
      status: "Failed",
      message: "You have  Google account under this email,use Google to login"
    })
  } else {
    if (!password) {
      res.status(500).json({
        status: "Failed",
        message: "To log into your account you must enter a password"
      })
    }
    const user = await Auth.findOne({email})

    if (!user) {
      return next(new ErrorHandler('User not found', 404))
    }
    if (!(await user.correctPassword(password, user.password))) {
      return next(new ErrorHandler('Incorrect password', 401))
    }


    // const newToken = await createToken()
    // user.saveToken(newToken)
    res.status(200).json({
      status: "Succeed",
      user
    })
  }

})

exports.forgotPassword = catchAsyncError(async (req, res, next) => {


  const user = await Auth.findOne({email: req.body.email})

  if (!user) {
    return next(new ErrorHandler("There is no user with that email address", 404))
  } else if (user.isGoogleAccount) {
    res.status(500).json({
      status: "Error",
      message: "You cant change password for Google account"
    })
  } else {
    const resetToken = user.createPasswordResetToken();
    await user.save({validateBeforeSave: false})

    try {
      await sendEmail(user, resetToken)
      res.status(200).json({
        status: "Succeed",
        message: "Check your email",

      })
    } catch (err) {
      res.status(500).json({
        status: "Failed",
        err
      })
    }

  }

})

exports.updatePassword = catchAsyncError(async (req, res) => {
  const {idUser} = req.params
  if (idUser && req.body.newPassword) {


    await Auth.findOneAndUpdate({_id: idUser}, {password: req.body.newPassword})

    res.status(200).json({
      status: "Succeed",
      message: "The password has been changed",
      newPassword: req.body.newPassword
    })
  }
})

exports.getUserByRandoCode = catchAsyncError(async (req, res) => {
  const {randomCode} = req.params

  const foundUser = await Auth.findOne({randomNumberToUpdatePassword: randomCode})

  res.status(200).json({
    status: "Succeed",
    foundUser
  })
})
exports.googleSingUp = catchAsyncError(async (req, res) => {

  const isAccountExist = await Auth.findOne({email: req.body.email})
  if (isAccountExist) {
    res.status(500).json({
      status: "Error",
      message: "This email has already been taken. Please use another email or log in to your account"
    })
  } else {
    const createdAccount = await Auth.create({
      email: req.body.email,
      emailVerified: req.body.email_verified,
      familyName: req.body.family_name,
      givenName: req.body.given_name,
      locale: req.body.locale,
      picture: req.body.picture,
      googleToken: req.body.sub,
      isGoogleAccount: true,
      password: 'default',
      confirmPassword: 'default'
    })

    res.status(200).json({
      status: "Succeed",
      createdAccount
    })
  }

})
exports.googleLogin = catchAsyncError(async (req, res) => {
  const {email, googleToken} = req.query

  const foundUser = await Auth.findOne({email: email, googleToken: googleToken})
  res.status(200).json({
    status: "Succeed",
    foundUser
  })
})

exports.getUser = catchAsyncError(async (req, res) => {
  const {token} = req.params

  const user = await Auth.findOne({$or: [{userToken: token}, {googleToken: token}]})

  res.status(200).json({
    status: "Succeed",
    user
  })
})

exports.editCard = catchAsyncError(async (req, res) => {
  const {idUser} = req.params;
  const {idCard, data} = req.body;

  try {
    const updatedUser = await Auth.findOneAndUpdate(
      {_id: idUser, "cards._id": idCard},
      {$set: {"cards.$": data}},
      {new: true}
    );

    if (!updatedUser) {
      return res.status(404).json({
        status: "Failed",
        message: "User or card not found"
      });
    }

    res.status(200).json({
      status: "Succeed",
      updatedUser
    });
  } catch (err) {
    res.status(500).json({
      status: "Failed",
      message: "Something went wrong" + err,
    });
  }
});


exports.addCard = catchAsyncError(async (req, res) => {
  const {idUser} = req.params;
  const {number} = req.body;

  try {
    const user = await Auth.findById(idUser);
    if (!user) {
      return res.status(404).json({
        status: "Failed",
        message: "User not found"
      });
    }

    const cardExists = user.cards.some(card => card.number === number);
    if (cardExists) {
      return res.status(400).json({
        status: "Failed",
        message: "Card with this number already exists"
      });
    }

    user.cards.push(req.body);
    const updatedUser = await user.save();

    res.status(200).json({
      status: "Succeed",
      updatedUser
    });
  } catch (err) {
    res.status(500).json({
      status: "Failed",
      message: "Something went wrong" + err,
    });
  }
});

exports.deleteCard = catchAsyncError(async (req, res) => {
  const {idUser} = req.params;
  const {idCard} = req.body;

  try {

    const updatedUser = await Auth.findByIdAndUpdate(
      idUser,
      {$pull: {cards: {_id: idCard}}},
      {new: true}
    );

    if (!updatedUser) {
      return res.status(404).json({
        status: "Failed",
        message: "User or card not found"
      });
    }

    res.status(200).json({
      status: "Succeed",
      updatedUser
    });
  } catch (err) {
    res.status(500).json({
      status: "Failed",
      message: "Something went wrong" + err,
    });
  }
});

exports.editUser = catchAsyncError(async (req, res) => {
  const {idUser} = req.params
  if (!idUser) {
    res.status(500).json({
      status: "Failed",
      message: "Id user mush be in"
    })
  } else {
    const updateUser = await Auth.findByIdAndUpdate(idUser, req.body, {
      new: true
    })
    if (updateUser) {
      res.status(200).json({
        status: "Succeed",
        updateUser
      })
    } else {
      res.status(500).json({
        status: "Failed",
        message: "Something went wrong"
      })
    }
  }

})

exports.setAvatar = catchAsyncError(async (req, res) => {
  const {idUser} = req.params
  const {newPicture} = req.body
  console.log(newPicture)
  const updatedUser = await Auth.findByIdAndUpdate(idUser, {picture: newPicture}, {new: true})
  if (!updatedUser) {
    res.status(500).json({
      status: "Failed",
      message: "User was not found"
    })
  } else {
    res.status(200).json({
      status: "Succeed",
      message: "Picture was updated",
      updatedUser
    })
  }
})

exports.sendConfirmCode = catchAsyncError(async (req, res) => {


  const user = await Auth.findOne({email: req.body.email})

  const resetCode = user.confirmEmail();
  await user.save({validateBeforeSave: false})
  try {
    await sendConfirmEmail(user, resetCode)
    res.status(200).json({
      status: "Succeed",
      message: "The code has been sent"
    })
  } catch (err) {
    res.status(500).json({
      status: "Failed",
      message: "Something went wrong",
    })
  }
})
exports.acceptConfirmCode = catchAsyncError(async (req, res) => {
  const {email, codeToConfirm} = req.body

  const user = await Auth.findOne({email: email},{new:true})
  if (user.acceptConfirmCode(codeToConfirm)) {
    res.status(200).json({
      status: "Succeed",
      message: "Email has been confirmed",
      user
    })
  } else {
    res.status(500).json({
      status: "Failed",
      message: "These codes arent the same"
    })
  }
})




