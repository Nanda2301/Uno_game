const jwt = require("jsonwebtoken");
const TokenBlacklist = require("../models/TokenBlacklist.js");

/**
 * Middleware de autenticação via JWT (JSON Web Token).
 * Verifica se a requisição possui um token válido no cabeçalho Authorization,
 * garantindo que tokens revogados (blacklist) ou malformados sejam rejeitados.
 *
 * @async
 * @middleware authMiddleware
 * @param {import('express').Request}  req  - Objeto de requisição do Express
 * @param {import('express').Response} res  - Objeto de resposta do Express
 * @param {import('express').NextFunction} next - Função para passar ao próximo middleware
 *
 * @returns {void} Em caso de sucesso, injeta o `userId` na requisição e chama `next()`.
 * Em caso de falha, retorna uma resposta HTTP 401 com a mensagem de erro correspondente.
 *
 * @returns {401} Token not provided     - Cabeçalho Authorization ausente
 * @returns {401} Invalid token          - Formato do cabeçalho inválido ou token expirado/inválido
 * @returns {400} Token incorrectly formatted - Esquema de autenticação diferente de "Bearer"
 * @returns {401} Token invalid (logged out)  - Token presente na blacklist (usuário deslogado)
 *
 * @example
 * // Aplicar em uma rota protegida
 * app.get("/perfil", authMiddleware, perfilController)
 *
 * @example
 * // Aplicar em um grupo de rotas
 * router.use(authMiddleware)
 * router.get("/dados", dadosController)
 *
 * @see TokenBlacklist - Modelo utilizado para verificar tokens revogados
 */
module.exports = async(req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader){
        return res.status(401).json({message: "Token not provided"});
    }

    const authData = authHeader.split(" ");
    const [scheme , token] = authData;
    if (authData.length !== 2) {
        return res.status(400).json({ error: "Invalid token"});
    } 
    if (!/^Bearer$/i.test(scheme)) {
        return res.status(400).json({ error: "Token incorrectly formatted!" });
    }

    const isBlacklisted = await TokenBlacklist.findOne({where: {token}});
    if(isBlacklisted){
        return res.status(401).json({message: "Token invalid (logged out"});
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
        req.userId = decoded.id;
        next();
    } catch (err){
        return res.status(401).json({message: "Invalid token"});
    }
};