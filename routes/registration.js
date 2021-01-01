const router = require('express').Router();
const fs = require('fs');
const path = require('path');
const pool = require('./dbPool.js');
const bcrypt = require('bcrypt');

const registerPage = fs.readFileSync(path.join(__dirname + '/../public/registration/register.html')).toString();
const { body, validationResult } = require('express-validator');
router.get('/registration/register', (req, res) => {
    return res.send(registerPage);
});

router.post('/registration/register',
    body('email', "Email is not valid").isEmail().escape(),
    body('password', "Password: min 5 characters").isLength({min: 5}).escape(),
    body('password', "Passwords needs to match").custom((value, { req }) => value === req.body.passwordC),
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