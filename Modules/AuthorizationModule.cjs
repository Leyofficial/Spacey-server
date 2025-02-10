const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')

const authSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "The user needs to have a email"],
    unique: [true, "This email has already taken"],
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, "Pleas a valid Email"]
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: "user"
  },
  password: {
    type: String,
    trim: true,
    minlength: 6
  },
  passwordConfirm: {
    type: String,
    trim: true,
    validate: {
      validator: function (el) {
        return el === this.password
      },
      message: "Password is not the same"
    }
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  randomNumberToUpdatePassword: String,
  isConfirm: {
    type: Boolean,
    default: false
  },
  confirmEmailCode: {
    type: String,
    default: ""
  },
  isGoogleAccount: {
    default: false,
    type: Boolean
  },
  emailVerified: Boolean,
  familyName: {
    type: String,
    default: ""
  },
  givenName: {
    type: String,
    default: ""
  },
  locale: String,
  picture: {
    type: String,
    default: ""
  },
  googleToken: String,
  userToken: String,
  cards: {
    type: [{
      number: Number | String,
      name: String,
      expiry: String,
      cvc: Number | String
    }],
    default: []
  },
  phone: {
    type: String | Number,
    default: ""
  },
  address: {
    type: {
      country: String,
      city: String,
      zipCode: Number | String
    },
    default: {
      country: "",
      city: "",
      zipCode: ""
    }
  },
  displayName: {
    type: String,
    default: "",
  },
  fullyName: {
    type: String,
    default: ""
  }
})


authSchema.methods.hashPassword = async function () {
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  await this.save()
}

authSchema.pre('findOneAndUpdate', async function (next) {

  const update = this.getUpdate()

  if (update.password) {

    const newPassword = update.password
    const hashedPassword = await bcrypt.hash(newPassword, 12)

    update.password = hashedPassword
  }
  next()

})
authSchema.methods.correctPassword = async function (
  candidatePassword
) {


  return await bcrypt.compare(candidatePassword, this.password);
}

authSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next()
  this.passwordChangedAt = Date.now() - 1000
  next();
})

authSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  const randomCode = crypto.randomBytes(6).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000
  this.randomNumberToUpdatePassword = randomCode
  return randomCode
}
authSchema.methods.confirmEmail =  function () {
  const code = crypto.randomBytes(8).toString('hex');
  this.confirmEmailCode = code
  return code
}
authSchema.methods.saveToken = async function (token) {
  this.userToken = token
  await this.save()
}


authSchema.methods.acceptConfirmCode = async function  (code) {
  if(this.confirmEmailCode === code){
    this.isConfirm = true
    await this.save()
  }else{
    return
  }

  return this.confirmEmailCode === code
}
const Auth = mongoose.model('authorizations', authSchema)
module.exports = Auth;