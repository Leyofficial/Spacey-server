const sgMail = require('@sendgrid/mail');
const ejs = require('ejs');
const path = require('path');
require('dotenv').config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


require('dotenv').config();
exports.sendEmail = async (user, resetToken) => {

  const msg = {
    to: user.email,
    from: process.env.EMAIL_USERNAME,
    subject: 'Password reset token',
    text: ` Code to confirm password change ${resetToken}`,
    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Confirm email</title>
    <style>
    </style>
</head>
<body>
<div style="margin: 0 auto; width: 70%; text-align: center;border: 1px solid orange; border-radius: 5px;padding: 40px">
    <img style="max-width: 300px;text-align: center;border-radius: 5px"
         src="https://spacey-server.vercel.app/uploads/65677f5725976d5338a91bf5" alt="logo"/>
    <h1 style="text-align: center">
       <span style="color: orange">Spacey</span> Support
    </h1>
    <div style="margin: 20px 0">
        <p style="font-size: 17px;color: black">We have received a request to change your account password.</p>
        <p  style="margin: 20px 0;font-size: 17px;color: black">Click on the button below to set a new password</p>
    </div>
    <div class="btnWrapper" style="width: 100% ; text-align: center">
        <a class="btn" style="align-items: center;justify-content: center;text-align: center; background: orange;padding: 10px 35px;font-size: 20px; text-decoration: none;color:white;border-radius: 5px" href="http://localhost:5173/user-account/reset-password/active/${resetToken}">CHANGE PASSWORD</a>
    </div>

</div>
</body>
</html>`
  }


  await sgMail.send(msg).then(res => console.log(res)).catch(err => console.log(err))


}

exports.sendConfirmEmail = async (user,resetCode) => {
  require('dotenv').config();
  const msg = {
    to: user.email,
    from: process.env.EMAIL_USERNAME,
    subject: 'Confirm email',
    text: ` Code to confirm password change ${resetCode}`,
    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Confirm email</title>
    <style>
    </style>
</head>
<body>
<div style="margin: 0 auto; width: 70%; text-align: center;border: 1px solid orange; border-radius: 5px;padding: 40px">
    <img style="max-width: 300px;text-align: center;border-radius: 5px"
         src="https://spacey-server.vercel.app/uploads/65677f5725976d5338a91bf5" alt="logo"/>
    <h1 style="text-align: center">
       <span style="color: orange">Spacey</span> Support
    </h1>
    <div style="margin: 20px 0">
        <p style="font-size: 17px;color: black">We have received a request to confirm your email</p>
        <p  style="margin: 20px 0;font-size: 17px;color: black">Copy this code and past in your profile setting</p>
    </div>
    <div class="btnWrapper" style="width: 100% ; text-align: center">
        <p class="btn" style="align-items: center;justify-content: center;text-align: center;border: 1px solid orange; color: orange background: black;padding: 10px 35px;font-size: 20px; text-decoration: none;border-radius: 5px">${resetCode}</p>
    </div>

</div>
</body>
</html>`
  }
  await sgMail.send(msg).then(res => console.log(res)).catch(err => console.log(err))
}


