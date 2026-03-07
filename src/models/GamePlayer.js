const { DataTypes } = require("sequelize");
const sequelize = require("../database");

/**
 * Modelo Sequelize que representa a tabela intermediária entre jogadores e partidas.
 * Gerencia a associação many-to-many entre `User` e `Game`, armazenando
 * informações específicas de cada jogador dentro de uma partida, como
 * posição na mesa, status de prontidão e pontuação acumulada.
 *
 * @model GamePlayer
 * @property {number}  gameId   - ID da partida associada (coluna: game_id)
 * @property {number}  playerId - ID do jogador associado (coluna: player_id)
 * @property {boolean} ready    - Indica se o jogador está pronto para iniciar (padrão: false)
 * @property {number}  position - Posição do jogador na mesa (valores: 1, 2, 3 ou 4)
 * @property {number}  score    - Pontuação acumulada do jogador na partida (padrão: 0)
 */
const GamePlayer = sequelize.define("GamePlayer", {
    gameId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'game_id'
    },
    playerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'player_id'
    },
    ready: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    position: {
        type: DataTypes.INTEGER, // Posição na mesa (1, 2, 3, 4)
        allowNull: false
    }, 
    score: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
}, {
    indexes: [
        {
            unique: true,
            fields: ["game_id", "player_id"]
        }, {
            unique: true,
            fields: ["game_id", "position"]
        }
    ]
}   
);

module.exports = GamePlayer;