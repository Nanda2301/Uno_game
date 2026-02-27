const { DataTypes } = require("sequelize");
const sequelize = require("../database");

/**
 * Modelo Sequelize que representa a pontuação de um jogador em uma partida.
 * Registra o resultado individual de cada jogador ao término de cada jogo,
 * permitindo o acompanhamento do desempenho e histórico de partidas.
 *
 * @model Score
 * @property {number} playerId - ID do jogador ao qual a pontuação pertence
 * @property {number} gameId   - ID da partida à qual a pontuação está associada
 * @property {number} score    - Pontuação obtida pelo jogador na partida
 */
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