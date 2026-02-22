const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const Card = sequelize.define("Card", {
    color: {
        type: DataTypes.STRING,
        allowNull: false 
    },
    value: {
        type: DataTypes.STRING,
        allowNull: false 
    },
    gameId: {
        type: DataTypes.INTEGER,
        allowNull: false 
    },
    pile: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'draw'
    },
    playerId: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
});

module.exports = Card;