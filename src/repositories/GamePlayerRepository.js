const GamePlayer = require("../models/GamePlayer.js");

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

    async findByPosition(gameId, position) {
      return await GamePlayer.findOne({
        where: { gameId, position }
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

    async findScoresByGameId(gameId) {
    return await GamePlayer.findAll({
        where: { gameId },
        attributes: ['playerId', 'score', 'position'],
        order: [['score', 'DESC']],
        raw: true
    });
}

    async delete(gamePlayer) { return await gamePlayer.destroy(); }

    


}

module.exports = new GamePlayerRepository();