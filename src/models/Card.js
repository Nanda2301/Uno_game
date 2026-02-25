const { DataTypes } = require("sequelize");
const sequelize = require("../database");

/**
 * Modelo Sequelize que representa uma carta dentro de uma partida do jogo.
 * Cada carta pertence a um jogo específico e pode estar associada
 * a um jogador ou em uma das pilhas do jogo.
 *
 * @model Card
 * @property {string}  color    - Cor da carta (ex: "red", "blue", "green", "yellow", "wild")
 * @property {string}  value    - Valor ou tipo da carta (ex: "5", "skip", "reverse", "draw2")
 * @property {number}  gameId   - ID do jogo ao qual a carta pertence
 * @property {string}  pile     - Pilha onde a carta se encontra (padrão: "draw")
 * @property {number|null} playerId - ID do jogador que possui a carta, ou nulo se estiver em uma pilha
 */
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