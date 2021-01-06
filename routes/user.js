const router = require('express').Router();
const fs = require('fs');
const path = require('path');
const pool = require(path.join(__dirname + '/../configs/dbPool.js'));

const registerPage = fs.readFileSync(path.join(__dirname + '/../public/user/register.html')).toString();
const forgotPasswordPage = fs.readFileSync(path.join(__dirname + '/../public/user/forgotpassword.html')).toString();
const insertKeyPage = fs.readFileSync(path.join(__dirname + '/../public/user/forgotpasswordKey.html')).toString();

const lib = require('./lib.js');

router.get('/user/register', (req, res) => {
    return res.send(registerPage);
});

router.get('/user/forgotpassword', (req, res) => {
    return res.send(forgotPasswordPage);
})

router.get('/user/forgotpasswordKey', (req, res) => {
    return res.send(insertKeyPage)
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
            const hashedPassword = await lib.hashPw(plainTextPassword);
            await pool.execute('INSERT INTO users SET email = ?, password = ?', [email, hashedPassword]);
            return res.send('user created');
        } catch (err) {
            return res.status(500).send(err);
        }
    }   
});

router.post('/user/forgotpassword', async (req, res) => {
    
    try {
        //check if user exists.
        const [rows] = await pool.execute('SELECT id FROM users where email = ?', [req.body.email])
        if(rows[0] === undefined || rows[0].length == 0) {
            return res.status(403).send('Email does not exist');
        };
        //if exists

        const userId = rows[0].id
        //Set cookie with id
        res.cookie('userId', userId);


        //delete key if it already exists
        await pool.execute('DELETE FROM forgot_password_keys SET id = ?', [userId])

        //generate key to reset password
        const tempKey = Math.random().toString(36).slice(-8);

        //store key in db
        await pool.execute('INSERT INTO forgot_password_keys SET id = ?, pwKey = ?', [userId, tempKey]);

        //create and send mail to user email.
        const email = req.body.email;  
        const subject = "Forgot password";
        const output = `
        <h3>Password reset!</h3>
        <h2>Key to reset password: ${tempKey}</h2>
        `
        const transporter = require(path.join(__dirname + '/../configs/nodemailer.js')); 
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: subject, 
            html: output
        };
    
        transporter.sendMail(mailOptions, (err, data) => {
            if(err){
                res.status(401).send(`Email not sent; Error ${err}`);
            } else {
                console.log("got here");
                res.redirect('/user/forgotpasswordKey')
            }
        });

    }catch(err){
        console.log(err);
    }

});

router.post('/user/submitTempKey', async(req, res) => {
    try {
        const tempKey = req.body.key;
        const userId = req.cookies['userId'];
        //--INSERT INTO forgot_password_keys(id, pwKey) VALUES (7, "3bnp7cbz");
        const [rows] = await pool.execute('SELECT pwKey FROM forgot_password_keys WHERE id = ?', [userId]);
        if(rows[0] === undefined || rows[0].length == 0) {
            return res.status(403).send('Key expired / wrong id, try again.');
        };
        if(tempKey === rows[0].pwKey){
            console.log("match");
        }
        


    } catch (err) {
        console.log(err);
    }
    
})

router.post('/user/changePassword', async(req, res) => {
    console.log(req.body.changeToPassword)
    console.log(req.body.confirmPassword)
    try {
        const hashedPassword = await lib.hashPw(plainTextPassword);
        //await pool.execute('UPDATE users SET password=? WHERE email=?',[hashedPassword, email]);    
    }catch(err){
        console.log(err);
    }  
})
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