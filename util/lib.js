const bcrypt = require('bcrypt');

async function hashPw(plainTextPassword){
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(plainTextPassword, saltRounds);
    return hashedPassword;
}

//module.exports = { hashPw, anotherHere};
module.exports = { hashPw };