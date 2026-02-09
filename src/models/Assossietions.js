const Game = require("./Game.js");
const GamePlayer = require("./GamePlayer.js");

Game.hasMany(GamePlayer, {
    foreignKey: "gameId",
    as: "players"
});

GamePlayer.belongsTo(Game, {
    foreignKey: "gameId",
    as: "game"
});

module.exports = {
  Game,
  GamePlayer
};