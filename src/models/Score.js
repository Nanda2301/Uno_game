const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const Score = sequelize.define("Score", {
    playerId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    gameId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    score: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

module.exports = Score;