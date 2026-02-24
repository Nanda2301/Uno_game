const APIUsageLog = require("../models/APIUsageLog")

const APITracker = async (req, res, next) => {
    const startTime = Date.now();

    res.on("finish", async()=>{ // Executa uma função quando a resposta terminar
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

            console.log("#".repeat(30))
            console.log(await APITracker.findAll()) // só para ver se funciona
            console.log("#".repeat(30))
        } catch(error){
            console.log("Não foi possível registrar o log. Info: ", error);
        }
    })

    next()
}