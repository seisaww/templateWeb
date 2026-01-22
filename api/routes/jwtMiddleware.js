const jwt = require('jsonwebtoken');
const { ACCESS_TOKEN_SECRET } = require("../config.js");

module.exports = {
    checkJwt: (req, res, next) => {
        const tokenHeader = req.headers['authorization'];

        if (!tokenHeader) {
            return res.status(401).send({ message: 'No token provided' });
        }

        const token = tokenHeader.replace('Bearer ', '').trim();

        try {
            const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
            
            req.token = decoded; 
            
            next();

        } catch (error) {
            console.log("Erreur Token:", error.message);
            return res.status(401).send({ message: 'Invalid token' });
        }
    }
};
