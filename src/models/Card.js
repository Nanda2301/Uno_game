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
    }
});

module.exports = Card;