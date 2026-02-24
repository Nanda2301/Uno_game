const APIUsageLog = require("../models/APIUsageLog")

const APITracker = async (req, res, next) => {
    const startTime = Date.now();

    // Executa uma função quando a resposta terminar
    res.on("finish", async()=>{ 
        try{
            const responseTime = Date.now() - startTime

            await APIUsageLog.create(
                {
                    responseTime: responseTime,
                    endpointAccess: req.originalUrl,
                    requestMethod: req.method,
                    statusCode: res.statusCode,
                    timestamp: new Date(),
                    userId: req.userId ? req.userId : null
                }
            )
        } catch(error){
            console.log("Não foi possível registrar o log. Info: ", error);
        }
    })

    next()
}

module.exports = APITracker