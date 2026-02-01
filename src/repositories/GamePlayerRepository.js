const GamePlayer = require("../models/GamePlayer");

class GamePlayerRepository {
    async create(data) {
        return await GamePlayer.create(data);
    }

    async findByGameId(gameId) {
        return await GamePlayer.findAll({
            where: { gameId }
        });
    }

    async findOne(gameId, playerId) {
        return await GamePlayer.findOne({
            where: { 
                gameId,
                playerId 
            }
        });
    }

    async update(gamePlayer, data) {
        return await gamePlayer.update(data);
    }

    async delete(gamePlayer) {
        return await gamePlayer.destroy();
    }

    async deleteAllByGameId(gameId) {
        return await GamePlayer.destroy({
            where: { gameId }
        });
    }
}

module.exports = new GamePlayerRepository();