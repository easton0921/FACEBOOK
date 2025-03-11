const auth = require('../Utility/jwt');
const User = require('../Models/user');
const constants = require('../Utility/constant')

//admin middleware 
async function adminJwtMiddleware(req, res, next) {
    try {
        const getToken = req.headers.authorization;
        if (!getToken) {
            return res.status(401).send('No token provided.');
        }
        const token = getToken.slice(7);
        console.log('token:', token);
        const decode = auth.verifyToken(token);
        console.log('decodetwo', decode)
    
        const user = await User.findOne({ _id: decode.id, jti: decode.jti,role:constants.role.ADMIN});
        if (!user||!user.jti||!user.role) {
            console.log('user',user)
            return res.status(404).json({ status: 'Unothorized....' })
        }
        console.log('user', user)
        req.user = user;
        next();
    } catch (err) {
        console.log('error', err)
        res.status(401).json({ status: err });
    }

};



//user middleware
async function jwtMiddleware(req, res, next) {
    try {
        const getToken = req.headers.authorization;
        if (!getToken) {
            return res.status(401).send('❌ No token provided.');
        }
        const token = getToken.slice(7);
        console.log('token:', token);
        const decode = auth.verifyToken(token);
        console.log('decodetwo', decode)
        

        const user = await User.findOne({ _id: decode.id, jti: decode.jti,role:constants.role.USER });
        if (!user||!user.jti||!user.role) {
            console.log('user',user)
            return res.status(404).json({ status:'Unothorized....'})
        }
        console.log('user ✅', user)
        req.user = user;
        next();
    
    } catch (err) {
        console.log('error ❌', err)
        res.status(401).json({ status: err });
    }
};



module.exports = {
    jwtMiddleware,
    adminJwtMiddleware,
}
