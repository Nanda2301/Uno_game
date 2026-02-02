const {DataTypes} = require("sequelize")
const sequelize = require("../database.js");

const TokenBlacklist = sequelize.define("TokenBlacklist", {
    token: {
        type: DataTypes.STRING(500),
        allowNull: false,
        unique: true
    }
});

module.exports = TokenBlacklist;