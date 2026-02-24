const APIUsageLog = require("../models/APIUsageLog")
const Result = require("../config/result")
const {fn, col} = require("sequelize")

/**
 * Serviço responsável pelo gerenciamento dos logs de uso da API.
 * Realiza a comunicação com o banco de dados por meio do modelo APIUsageLog.
 *
 * @class APIUsageLogService
 */
class APIUsageLogService{

    /**
     * Registra um novo log de uso da API no banco de dados.
     *
     * @async
     * @method register
     * @param {Object} apiUsageLogData - Dados do log a ser registrado
     * @param {number} apiUsageLogData.responseTime - Tempo de resposta em milissegundos
     * @param {string} apiUsageLogData.endpointAccess - Endpoint acessado
     * @param {string} apiUsageLogData.requestMethod - Método HTTP utilizado
     * @param {number} apiUsageLogData.statusCode - Código de status HTTP retornado
     * @param {Date}   apiUsageLogData.timestamp - Data e hora da requisição
     * @param {number|null} apiUsageLogData.userId - ID do usuário autenticado ou nulo
     *
     * @returns {Promise<Result>} Retorna um Result de sucesso com os dados do log criado,
     * ou um Result de falha com o erro ocorrido
     */
    async register(apiUsageLogData){
        try{
            const newInstance = await APIUsageLog.create(apiUsageLogData)
            return Result.of(newInstance.dataValues)
        }catch(error){
            return Result.fail(error)
        }
    }

    async countRequest(){
        try{
            const allLogs = await APIUsageLog.findAll({raw: true})
            const breakdown = allLogs.reduce((acc, log) => {
                    const endPoint = log.endpointAccess
                    const method = log.requestMethod

                    if(!acc[endPoint]) acc[endPoint] = {};
                    if(!acc[endPoint][method]) acc[endPoint][method] = 0;

                    acc[endPoint][method] += 1
                    return acc
                }, 
                {})
            
            const total_requests = allLogs.length
            return Result.of({total_requests, breakdown})

        }catch(error){
            return Result.fail(error)
        }
    }

    async countStatusCode(){
        try{
            const allLogs = await APIUsageLog.findAll({raw:true})

            const data = allLogs.reduce((acc, log)=>{
                const status = log.statusCode

                if(!acc[status]) acc[status] = 0;
                acc[status] += 1

                return acc
            }, {})

            return Result.of(data)
        }catch(error){
            return Result.fail(error)
        }
    }

    async mostPopularEndpoint(){
        try{
            const data = await APIUsageLog.findOne({
                attributes:[
                    ['endpointAccess', "most_popular"],
                    [fn("COUNT", col('endpointAccess')), "request_count"]
                ],
                group: ["endpointAccess"],
                order: [[fn("COUNT", col("endpointAccess")), "DESC"]]
            })

            return Result.of(data)

        }catch(erro){
            return Result.fail(error)
        }
    }

    async requestResponseTime(){
        try{

            const logs = await APIUsageLog.findAll({
                attributes:[
                    ['endpointAccess', 'endpoint'],
                    [fn("AVG", col("responseTime")), "avg"],
                    [fn("MIN", col("responseTime")), "min"],
                    [fn("MAX", col("responseTime")), "max"]
                ],

                group: ["endpointAccess"],

                raw:true
            })

            const data = logs.reduce((acc, log) =>{
                acc[log.endpoint] = {
                    avg: log.avg,
                    min: log.min,
                    max: log.max
                }
                return acc
            }, {})

            return Result.of(data)
        }catch(erro){
            return Result.fail(erro)
        }
    }
}

module.exports = new APIUsageLogService()