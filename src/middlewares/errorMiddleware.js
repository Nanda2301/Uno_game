const logger = require('../config/logger');

function errorMiddleware(err, req, res, next) {

    logger.error({
        message: err.message,
        stack: err.stack,
        method: req.method,
        url: req.originalUrl,
        body: req.body
    });

    res.status(500).json({
        error: 'Erro interno do servidor'
    });
}

module.exports = errorMiddleware;