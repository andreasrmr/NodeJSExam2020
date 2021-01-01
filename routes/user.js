const router = require('express').Router();
const fs = require('fs');
const path = require('path');
const pool = require('./dbPool.js');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

const registerPage = fs.readFileSync(path.join(__dirname + '/../public/user/register.html')).toString();
const forgotPasswordPage = fs.readFileSync(path.join(__dirname + '/../public/user/forgotpassword.html')).toString();

const lib = require('./lib.js');

router.get('/user/register', (req, res) => {
    return res.send(registerPage);
});

router.get('/user/forgotpassword', (req, res) => {
    return res.send(forgotPasswordPage);
})

const { body, validationResult } = require('express-validator');

router.post('/user/register',
    body('email', 'Email is not valid').isEmail().escape(),
    body('password', 'Password: min 5 characters').isLength({min: 5}).escape(),
    body('password', 'Passwords needs to match').custom((value, { req }) => value === req.body.passwordC),
    async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() })
    }
    else {
        try {
            const plainTextPassword = req.body.password;
            const email = req.body.email;
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(plainTextPassword, saltRounds);
            await pool.execute('INSERT INTO users SET email = ?, password = ?', [email, hashedPassword]);
            return res.send('user created');
        } catch (err) {
            return res.status(500).send(err);
        }
    }   
});

router.post('/user/forgotpassword', async (req, res) => {
    const email = req.body.email;  
    const subject = "Forgot password"; 
    const temporaryPassword = Math.random().toString(36).slice(-8);
    try {
        const hashedPassword = await lib.hashPw(temporaryPassword);
        await pool.execute('UPDATE users SET password=? WHERE email=?',[hashedPassword, email]);    
    }catch(err){
        console.log(err);
    }
    
    const output = `
        <h3>Password reset!</h3>
        <h2>New password: ${temporaryPassword}</h2>
        `
    
    const transporter = nodemailer.createTransport({
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

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: subject, 
        html: output
    };

    transporter.sendMail(mailOptions, (err, data) => {
        if(err){
            console.log(`Error: ${err}`);
            res.status(401).send('Email not sent');
        } else {
            res.status(200).send('Email sent');
        }
    });

});
/*
router.post('/registration/createTestUser', async (req, res) => {
    try {
        const plainTextPassword = req.body.password;
        const email = req.body.email;
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(plainTextPassword, saltRounds);
        await pool.execute('INSERT INTO users SET email = ?, password = ?', [email, hashedPassword]);
        return res.send('user created');
    } catch (err) {
        return res.status(500).send(err);
    }
});
*/

module.exports = router;