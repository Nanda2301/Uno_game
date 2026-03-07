const Game = require("../models/Game.js");
const GamePlayer = require("../models/GamePlayer.js")

class GameRepository {
    async create(data) {
        return await Game.create(data);
    }

    async findAll() {
        return await Game.findAll({raw:true});
    }

    async findById(id, raw=false) {
        if(raw) return Game.findByPk(id, {raw})

        return await Game.findByPk(id, {
            include: [
                {
                    model: GamePlayer,
                    as: "players",
                    attributes: ["id", "playerId", "ready", "position", "score"]
                }
            ],
        });
    }

    async update(id, data, options = {}) {
        const game = await Game.findByPk(id);
        if (!game) return null;

        if ("title" in data) game.title = data.title;
        if ("status" in data) game.status = data.status;
        if ("maxPlayers" in data) game.maxPlayers = data.maxPlayers;
        if ("topDiscardCardId" in data) game.topDiscardCardId = data.topDiscardCardId;
        if ("currentPlayerPosition" in data) game.currentPlayerPosition = data.currentPlayerPosition;
        if ("direction" in data) game.direction = data.direction;
        if ("creatorId" in data) game.creatorId = data.creatorId;

        await game.save(options);
        return game.get({ plain: true });
    }

    async delete(id) {
       const gameToDelete = await Game.findByPk(id)
       if(!gameToDelete){
            return null
       }
       await gameToDelete.destroy()
       return true
    }

    async gameExists(id){
        const count = await Game.count({where: {id}})
        return count > 0;
    }
}

module.exports = new GameRepository();