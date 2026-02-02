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
        defaultValue: 'waiting' // waiting | in_progress | finished
    },
    maxPlayers: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    creatorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'creator_id' // Nome da coluna no banco
    }
    ,currentPlayerPosition: {
    type: DataTypes.INTEGER,
    defaultValue: 1
    },
    
    direction: {
    type: DataTypes.INTEGER, // 1 = horário | -1 = anti-horário
    defaultValue: 1
    },
    topDiscardCardId: {
    type: DataTypes.INTEGER,
    allowNull: true
}

});

module.exports = Game;