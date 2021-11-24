const jwtHelper = require("../utils/jwt.helper");
 
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

 
let isAuth = async (req, res, next) => {
    const tokenFromClient = req.headers["x-access-token"];
    if (tokenFromClient) {
        try {
            const decoded = await jwtHelper.verifyToken(tokenFromClient, accessTokenSecret);
            req.jwtDecoded = decoded;
            next();
        } catch (error) {
            next();
        }
    } else {
        next();
    };
    
}

module.exports = {
    isAuth: isAuth,
};