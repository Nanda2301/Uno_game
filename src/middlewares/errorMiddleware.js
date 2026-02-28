const logger = require('../config/logger');

/**
 * Middleware global de tratamento de erros da aplicação.
 * Recebe erros repassados via `next(result)` pelos controladores,
 * registra as informações no logger e retorna uma resposta HTTP padronizada.
 *
 * Deve ser registrado após todas as rotas na aplicação para
 * interceptar corretamente os erros propagados.
 *
 * @function errorMiddleware
 * @param {Result} resultError          - Objeto Result de falha contendo o erro e o status HTTP
 * @param {Error}  resultError.error    - Instância do erro ocorrido
 * @param {number} resultError.status   - Código de status HTTP a ser retornado
 * @param {import('express').Request}  req  - Objeto de requisição do Express
 * @param {import('express').Response} res  - Objeto de resposta do Express
 * @param {import('express').NextFunction} next - Função para repasse ao próximo middleware
 *
 * @returns {void} Retorna uma resposta HTTP com o status e a mensagem de erro
 *
 * @example
 * // Registrar na aplicação após todas as rotas
 * app.use(routes)
 * app.use(errorMiddleware)
 *
 * @example
 * // Resposta de erro retornada ao cliente:
 * // Status: 404
 * // { "error": "User not found" }
 *
 * @see Result
 * @see logger
 */
function errorMiddleware(resultError, req, res, next) {
    const error = resultError.error
    const statusCode = resultError.status

    logger.error({
        message: error.message,
        stack: error.stack,
        method: req.method,
        url: req.originalUrl,
        body: req.body
    });
    
    return res.status(statusCode).json({error: error.message});
}

module.exports = errorMiddleware;