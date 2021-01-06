const nodemailer = require('nodemailer');

module.exports = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    service: 'gmail',
    secure: false, 
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }, 
    tls: {
        rejectUnauthorized:false
    }
});


