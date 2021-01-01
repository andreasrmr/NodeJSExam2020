const router = require('express').Router();
const fs = require('fs');
const path = require('path');

const registerPage = fs.readFileSync(path.join(__dirname + '/../public/registration/register.html')).toString();

router.get('/registration/register', (req, res) => {
    return res.send(registerPage);
});

const { body, validationResult } = require('express-validator');

router.post('/registration/register',
    body('email').isEmail(),
    body('password').isLength({ min: 5}),
    (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() })
    }
    else {
        /*
        try {
            const plainTextPassword = req.body.password;
            const email = req.body.email;
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(plainTextPassword, saltRounds);
            await pool.execute('INSERT INTO users SET email = ?, password = ?', [email, hashedPassword]);
            return res.redirect("/login");
        } catch (err) {
            return res.status(500).send(err);
        }*/
        res.send("success");
    }   
});

module.exports = router;