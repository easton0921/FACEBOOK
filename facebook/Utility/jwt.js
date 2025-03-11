const jwt = require('jsonwebtoken');
require('dotenv').config();

//secret key
const secretkey = process.env.SECRET_KEY;
const time = process.env.EXPIRES_IN ;

//getrate token 
function genToken(payload){
    const token = jwt.sign(payload,secretkey,{expiresIn:time});
    console.log("token ",token);
    return token;
};
//verify token
function verifyToken(token){  
        const decoded = jwt.verify(token,secretkey);
        console.log("decoded",decoded);
        return decoded;
    };

module.exports = {
    genToken,
    verifyToken,
};

