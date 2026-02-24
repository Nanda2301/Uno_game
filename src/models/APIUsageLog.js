const { DataTypes } = require("sequelize");
const sequelize = require("../database");

/**
 * Modelo Sequelize para registro de logs de uso da API.
 * Armazena informações sobre cada requisição realizada,
 * incluindo tempo de resposta, endpoint acessado e status HTTP.
 *
 * @model APIUsageLog
 * @property {number} id - Identificador único do log (chave primária, auto incremento)
 * @property {number} responseTime - Tempo de resposta da requisição em milissegundos
 * @property {string} endpointAccess - Endpoint da API que foi acessado
 * @property {string} requestMethod - Método HTTP utilizado (GET, POST, PUT, DELETE, etc.)
 * @property {number} statusCode - Código de status HTTP retornado pela requisição
 * @property {Date} timestamp - Data e hora em que a requisição foi realizada
 * @property {number|null} userId - ID do usuário que realizou a requisição (nulo se não autenticado)
 */

const APIUsageLog = sequelize.define("APIUsageLog", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    responseTime: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    endpointAccess: {
        type: DataTypes.STRING,
        allowNull: false
    },
    requestMethod: {
        type: DataTypes.STRING,
        allowNull: false
    },
    statusCode: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    timestamp: {
        type: DataTypes.DATE,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
})

module.exports = APIUsageLog