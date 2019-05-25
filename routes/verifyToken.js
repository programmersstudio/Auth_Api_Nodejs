const jwt = require('jsonwebtoken');

module.exports = function authVerifier(req, res, next){
    const token = req.header('auth-token');
    if(!token) return res.status(401).send('Access Denined');

    try{
        const verified = jwt.verify(token, process.env.TOKEN_SCERET);
        req.user = verified;
        next();
    }catch(error){
        res.status(400).send('Invalid Token');
    }
}