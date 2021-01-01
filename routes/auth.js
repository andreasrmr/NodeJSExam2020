const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('./dbPool.js');

//cookie optionas
const accessTokenOptions = {
    maxAge: 30000, //30 sekunder bør sættes op
    httpOnly: false
}

const refreshTokenOptions = {
    maxAge: 90000, //90 sekunder bør sættes op
    httpOnly: false
}

router.post('/auth/login', async (req, res) => {
    try {
        const email = req.body.email;
        //promise wrapper
        const [rows, fields] = await pool.execute('SELECT id,password FROM users WHERE email = ?', [email]);
        if(rows[0] === undefined || rows[0].length == 0) {
            return res.status(403).send('Username incorrect');
        };
        const userId = rows[0].id;
        const hashedPassword = rows[0].password;
        const plainTextPassword = req.body.password;
        const isCorrectPW = await bcrypt.compare(plainTextPassword, hashedPassword);        
        if(isCorrectPW){
            //user authenticated here.
            const user = { name: email };
            const accessToken = generateAccessToken(user);
            const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
            
            //delete old refreshToken if it exists
            await pool.execute('DELETE FROM refresh_tokens WHERE id = ?', [userId]);
            
            //store new refreshToken in db   
            await pool.execute('INSERT INTO refresh_tokens SET id = ?, token = ?', [userId, refreshToken]);
            
            //Store cookies in browser   
            res.cookie('accessToken', accessToken, accessTokenOptions);
            res.cookie('refreshToken', refreshToken, refreshTokenOptions);
            res.cookie('userId', userId);
            res.cookie('email', email);
        
            return res.send('Your logged in');
        }
        else {
            return res.status(403).send('Password incorrect');
        }  
        
    } catch (err) {
        return res.status(500).send(err);
    }
});

router.post('/auth/logout', async (req, res) => {
    try {
        const refreshToken = req.body.refreshToken;
        //Sæt cookies på client.
        res.cookie('accessToken', '');
        res.cookie('refreshToken', '');
        //delete old refreshToken if it exists
        await pool.execute('DELETE FROM refresh_tokens WHERE token = ?', [refreshToken]);
        return res.send('Your logged out');

    }catch(err) {
        return res.status(500).send(err);
    }
});

//User can renew access access token with their refreshToken.
router.post('/auth/token', async (req, res) => {
    const refreshToken = req.body.token;
    const userId = req.body.userId;
    if(refreshToken == null) {
        return res.status(401).send('Please login'); 
    }
    const storedRefreshToken = await pool.execute('SELECT token FROM refresh_tokens WHERE id = ?', [userId]);
    //check if users given refreshToken exists in db
    if(!storedRefreshToken[0][0].token === refreshToken){
        return res.status(403).send('Refresh token is not working. Try Logging in again.');
    };
    //very og generer ny access token.
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if(err) {
            return res.status(403).send('refreshToken is not available / valid. Please register / login again');
        };
        const accessToken = generateAccessToken({ name: user.name })
        //save cookie
        res.cookie('accessToken', accessToken, accessTokenOptions);       
        res.send('new access token set.')
    })
});

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '120s' })
}

module.exports = router;


