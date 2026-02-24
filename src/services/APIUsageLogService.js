const APIUsageLog = require("../models/APIUsageLog")
const Result = require("../config/result")

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
     *
     * @example
     * const service = new APIUsageLogService()
     * const result = await service.register({
     *     responseTime: 120,
     *     endpointAccess: "/api/users",
     *     requestMethod: "GET",
     *     statusCode: 200,
     *     timestamp: new Date(),
     *     userId: 42
     * })
     *
     * if (result.ok) {
     *     console.log(result.value) // Dados do log salvo
     * } else {
     *     console.error(result.error) // Erro ocorrido
     * }
     */
    async register(apiUsageLogData){
        try{
            const newInstance = await APIUsageLog.create(apiUsageLogData)
            return Result.of(newInstance.dataValues)
        }catch(error){
            return Result.fail(error)
        }
    }
}

module.exports = new APIUsageLogService()