const jwt = require("jsonwebtoken");
require("dotenv").config();

function userMiddleware(req, res, next) {
    const token = req.headers.token;
    // console.log("Token in middlware : " + token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("token "+token)
    if(decoded) {
        req.walletAddress = decoded.walletAddress;
        next();
    } else {
        res.status(403).json({
            message: "You are not signed in"
        })
    }
}

module.exports = {
    userMiddleware: userMiddleware
}