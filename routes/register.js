const router = require('express').Router();
const fs = require('fs');
const path = require('path');
const pool = require(path.join(__dirname + '/../configs/mysqlPool.js'));

const registerPage = fs.readFileSync(path.join(__dirname + '/../public/user/register.html')).toString();

const lib = require('./lib.js');

router.get('/user/register', (req, res) => {
    return res.send(registerPage);
});

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

module.exports = router;

/* opret test bruger
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