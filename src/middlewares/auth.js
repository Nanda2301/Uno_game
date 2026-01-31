const jwt = require("jsonwebtoken");
const TokenBlacklist = require("../models/TokenBlacklist.js");

module.exports = async(req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader){
        return res.status(401).json({message: "Token not provided"});
    }

    const [ , token] = authHeader.split(" ");

    const isBlacklisted = await TokenBlacklist.findOne({where: {token}});
    if(isBlacklisted){
        return res.status(401).json({message: "Token invalid (logged out"});
    }

    try{
        const decoded = jwt.verify(token, "CHAVEULTRASECRETA");
        req.userId = decoded.id;
        next();
    } catch (err){
        return res.status(401).json({message: "Invalid token"});
    }
};