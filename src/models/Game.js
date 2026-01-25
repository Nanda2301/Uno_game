const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const Game = sequelize.define("Game", {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING, 
        allowNull: false,
        defaultValue: 'active'
    },
    maxPlayers: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

module.exports = Game;