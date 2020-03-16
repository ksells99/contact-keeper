const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
    // GET TOKEN FROM HEADER
    const token = req.header('x-auth-token');   // get key to token from header

    // CHECK IF NO TOKEN
    if(!token) {
        return res.status(401).json({msg: 'Unauthorised access - no token'});
    }

    // If there is a token...

    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'));             // verify jwt and pull out the payload

        req.user = decoded.user;                                            // set request.user to have access in route
        next();
    } catch (error) {
        res.status(401).json({msg: 'Invalid token'});
    }
}