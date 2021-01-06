const nodemailer = require('nodemailer');

module.exports = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    service: process.env.EMAIL_SERVICE,
    secure: false, 
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }, 
    tls: {
        rejectUnauthorized:false
    }
});


