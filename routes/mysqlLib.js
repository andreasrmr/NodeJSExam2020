const mysql = require('mysql2/promise');

const pool = require('./dbPool.js');


async function checkIfEmailExists(email){
    try {
        const [rows] = await pool.execute('SELECT email from USERS where email = ?', [email]);
        checkIfRowsReturned(rows);
        return true;
        

    }catch(err) {

    }
    
}

function checkIfRowsReturned(rows){
    if(rows[0] === undefined || rows[0].length == 0) {
        return res.status(403).send('Email does not exist');
    };
}