const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const Card = sequelize.define("Card", {
    cardNumber: {
        type: DataTypes.STRING(16),
        allowNull: false
    },
    cardHolderName: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    expirationDate: {
        type: DataTypes.STRING(5), // Formato MM/YY
        allowNull: false
    },
    cvv: {
        type: DataTypes.STRING(3),
        allowNull: false
    },
    nickname: {
        type: DataTypes.STRING(50),
        allowNull: true
    }
});

module.exports = Card;