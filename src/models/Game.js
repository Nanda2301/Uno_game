const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const Game = sequelize.define("Game", {
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    releaseDate: {
        type: DataTypes.DATEONLY,
        allowNull: true
    }
});

module.exports = Game;