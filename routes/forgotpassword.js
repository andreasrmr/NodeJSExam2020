const router = require('express').Router();
const fs = require('fs');
const path = require('path');
const pool = require(path.join(__dirname + '/../configs/mysqlPool.js'));

const forgotPasswordPage = fs.readFileSync(path.join(__dirname + '/../public/forgotpassword/submitEmail.html')).toString();
const insertKeyPage = fs.readFileSync(path.join(__dirname + '/../public/forgotpassword/submitTempKey.html')).toString();
const changePasswordPage = fs.readFileSync(path.join(__dirname + '/../public/forgotpassword/changePassword.html')).toString();

const lib = require(path.join(__dirname + '/../util/lib.js'));

router.get('/forgotpassword/submitEmail', (req, res) => {
    return res.send(forgotPasswordPage);
});

router.get('/forgotpassword/submitTempKey', (req, res) => {
    return res.send(insertKeyPage);
});

router.get('/forgotpassword/changePassword', (req, res) => {
    return res.send(changePasswordPage);
})

const { body, validationResult } = require('express-validator');

router.post('/forgotpassword/submitEmail', async (req, res) => {
    
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
        await pool.execute('DELETE FROM forgot_password_keys WHERE id = ?', [userId])

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
                res.redirect('/forgotpassword/submitTempKey')
            }
        });

    }catch(err){
        console.log(err);
    }

});

router.post('/forgotpassword/submitTempKey', async(req, res) => {
    try {
        const tempKey = req.body.key;
        const userId = req.cookies['userId'];
        const [rows] = await pool.execute('SELECT pwKey FROM forgot_password_keys WHERE id = ?', [userId]);
        if(rows[0] === undefined || rows[0].length == 0) {
            return res.status(403).send('Key expired / wrong id, try again.');
        };
        //Key matches
        if(tempKey === rows[0].pwKey){
            res.redirect('/forgotpassword/changePassword')
        }
        //Key does not match.
        else {
            return res.status(403).send('Wrong key, try again.')
        }
    } catch (err) {
        console.log(err);
    }
    
})


router.post('/forgotpassword/changePassword', 
body('changeToPassword', 'Password: min 8 characters').isLength({min: 8}).escape(),
body('changeToPassword', 'Passwords needs to match').custom((value, { req }) => value === req.body.confirmPassword),
async(req, res) => {    
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        //TODO fix frontenddelen af dette return.
        return res.status(400).json({ errors: errors.array() })
    }
        //TODO check om brugeren eksistere i forvejen.
    else {
        const plainTextPassword = req.body.changeToPassword
        try {
            const userId = req.cookies['userId'];
            const hashedPassword = await lib.hashPw(plainTextPassword);
            await pool.execute('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId]);
            return res.send("Password changed");
            //problem - Der bør oprettes en token. der bekræfter at det er den rigtig bruger der kalder denne post.
        }catch(err){
            console.log(err);
        }  
    }
});

module.exports = router;