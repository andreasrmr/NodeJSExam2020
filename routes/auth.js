const router = require('express').Router();
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

const pool = mysql.createPool({
    host        : process.env.DB_HOST,
    user        : process.env.DB_USER,
    password    : process.env.DB_SECRET,
    database    : process.env.DB_DBNAME,
    port        : process.env.DB_PORT,
    waitForConnections  : true,
    connectionLimit     : 10,
    queueLimit          : 0
});

router.post("/auth/login", async (req, res) => {
    try {
        const email = req.body.email;
        //promise wrapper
        const [rows, fields] = await pool.execute('SELECT id,password FROM users WHERE email = ?', [email]);
        if(rows[0] === undefined || rows[0].length == 0) {
            return res.status(403).send("Username incorrect");
        };
        const hashedPassword = rows[0].password;
        const plainTextPassword = req.body.password;
        const isCorrectPW = await bcrypt.compare(plainTextPassword, hashedPassword);        
        if(isCorrectPW){
            return res.send("Your logged in");
        }
        else {
            return res.status(403).send("Password incorrect");
        }  
        
    } catch (err) {
        return res.status(500).send(err);
    }
});

router.post("/auth/register", async (req, res) => {
    try {
        const plainTextPassword = req.body.password;
        const email = req.body.email;
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(plainTextPassword, saltRounds);
        await pool.execute('INSERT INTO users SET email = ?, password = ?', [email, hashedPassword]);
        return res.redirect("/login");
    } catch (err) {
        return res.status(500).send(err);
    }
});

module.exports = router;


