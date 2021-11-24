const nodemailer = require('nodemailer');
const ejs = require("ejs");
const fs = require("fs");

function sendEmail(userEmail , fName , lName) {
  var transporter = nodemailer.createTransport({
    host : "smtp.mailtrap.io",
    port : 587,
    auth: {
      user: 'ecad808f0ab0d3',
      pass: 'd334b050c89f44'
    }
  });
  var mailOptions = {
    from: 'youremail@gmail.com',
    to: userEmail,
    subject: 'Sending Email using Node.js',
    html : `<!DOCTYPE html>
    <html lang="en">
        <head>
            <title></title>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <link href="css/style.css" rel="stylesheet">
        </head>
        <body>
            <h3>welcome mr  ${fName} ${lName}  in my application </h3>
            <p>we import on your privacy</p>
            <a class="btn btn-primary" href="http://localhost:3000/signUp/ahmed">active your account</a>
        </body>
    </html>`
    
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error)
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}





module.exports = {
  sendEmail
}