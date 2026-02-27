const { DataTypes } = require("sequelize");
const sequelize = require("../database");

/**
 * Modelo Sequelize que representa uma partida do jogo.
 * Controla o estado geral da partida, incluindo status, direção de jogo,
 * turno atual e a carta no topo da pilha de descarte.
 *
 * @model Game
 * @property {string}  title                - Título ou nome da partida
 * @property {string}  status               - Estado atual da partida (padrão: "waiting")
 *                                            Valores possíveis: "waiting" | "in_progress" | "finished"
 * @property {number}  maxPlayers           - Número máximo de jogadores permitidos na partida
 * @property {number}  creatorId            - ID do usuário que criou a partida (coluna: creator_id)
 * @property {number}  currentPlayerPosition - Posição do jogador com o turno atual (padrão: 1)
 * @property {number}  direction            - Direção de rotação dos turnos (padrão: 1)
 *                                            Valores possíveis: 1 = horário | -1 = anti-horário
 * @property {number|null} topDiscardCardId - ID da carta no topo da pilha de descarte,
 *                                            ou nulo se a pilha estiver vazia
 */
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
    },
    currentPlayerPosition: {
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