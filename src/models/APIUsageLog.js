const { DataTypes } = require("sequelize");
const sequelize = require("../database");

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