const {DataTypes} = require("sequelize")
const sequelize = require("../database.js");

/**
 * Modelo Sequelize para armazenamento de tokens JWT invalidados.
 * Utilizado para implementar o mecanismo de logout, garantindo que
 * tokens revogados não possam ser reutilizados mesmo antes de expirarem.
 *
 * @model TokenBlacklist
 * @property {string} token - Token JWT invalidado (máx. 500 caracteres, único)
 */
const TokenBlacklist = sequelize.define("TokenBlacklist", {
    token: {
        type: DataTypes.STRING(500),
        allowNull: false,
        unique: true
    }
});

module.exports = TokenBlacklist;