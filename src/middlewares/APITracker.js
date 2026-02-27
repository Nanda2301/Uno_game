const APIUsageLogService = require("../services/APIUsageLogService")

/**
 * Middleware para rastreamento e registro de uso da API.
 * Intercepta todas as requisições e, ao término de cada resposta,
 * salva automaticamente um log com as informações da requisição.
 *
 * @async
 * @function APITracker
 * @param {import('express').Request} req - Objeto de requisição do Express
 * @param {import('express').Response} res - Objeto de resposta do Express
 * @param {import('express').NextFunction} next - Função para passar ao próximo middleware
 *
 * @listens res#finish - Aguarda o evento de finalização da resposta para calcular
 * o tempo total e registrar o log
 */

const APITracker = async (req, res, next) => {
    const startTime = Date.now();

    res.on("finish", async()=>{ 
        const responseTime = Date.now() - startTime

        const APIUsageLogData = {
            responseTime: responseTime,
            endpointAccess: req.originalUrl,
            requestMethod: req.method,
            statusCode: res.statusCode,
            timestamp: new Date(),
            userId: req.userId ? req.userId : null,
        }

        const result = await APIUsageLogService.register(APIUsageLogData)

        if(result.ok){
            console.log(`\x1b[32m Log de uso da API registrado com sucesso [${new Date()}]\x1b[0m`)
        }else{
            console.log(`\x1b[31m Falha ao salvar log de uso da API [${new Date()}] \x1b[0m`)
            console.log("Mensagem de erro: ", result.error)
        }
    })

    next()
}

module.exports = APITracker