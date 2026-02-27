const logger = require('../config/logger');

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