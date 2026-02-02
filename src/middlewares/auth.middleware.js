const jwt = require("jsonwebtoken")

module.exports = function auth(req, res, next){
    const authHeader = req.headers.authorization

    if (!authHeader){
        return res.status(401).json({error: "Token não fornecido!"})
    }

    const [,token] = authHeader.split(" ");

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.userId = decoded.id;
        next();
    }catch(err){
        return res.status(401).json({error:"Inválid token"})
    }
}