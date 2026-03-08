const User = require("./User");
const Game = require("./Game");
const GamePlayer = require("./GamePlayer");
const Card = require("./Card");
const Score = require("./Score");

// Criador do jogo
Game.belongsTo(User, {
  foreignKey: "creatorId",
  as: "creator"
});

User.hasMany(Game, {
  foreignKey: "creatorId",
  as: "createdGames"
});

// Relação jogo x jogador
Game.hasMany(GamePlayer, {
  foreignKey: "gameId",
  as: "players"
});

GamePlayer.belongsTo(Game, {
  foreignKey: "gameId",
  as: "game"
});

User.hasMany(GamePlayer, {
  foreignKey: "playerId",
  as: "gameEntries"
});

GamePlayer.belongsTo(User, {
  foreignKey: "playerId",
  as: "player"
});

// Relação cartas
Game.hasMany(Card, {
  foreignKey: "gameId",
  as: "cards"
});

Card.belongsTo(Game, {
  foreignKey: "gameId",
  as: "game"
});

User.hasMany(Card, {
  foreignKey: "playerId",
  as: "handCards"
});

Card.belongsTo(User, {
  foreignKey: "playerId",
  as: "owner"
});

// Relação pontuações
Game.hasMany(Score, {
  foreignKey: "gameId",
  as: "scores"
});

Score.belongsTo(Game, {
  foreignKey: "gameId",
  as: "game"
});

User.hasMany(Score, {
  foreignKey: "playerId",
  as: "historicalScores"
});

Score.belongsTo(User, {
  foreignKey: "playerId",
  as: "player"
});

module.exports = {
  User,
  Game,
  GamePlayer,
  Card,
  Score
};