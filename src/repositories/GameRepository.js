const Game = require("../models/Game.js");
const GamePlayer = require("../models/GamePlayer.js")

class GameRepository {
    async create(data) {
        return await Game.create(data);
    }

    async findAll() {
        return await Game.findAll({raw:true});
    }

    async findById(id, raw=true) {
        return await Game.findByPk(id, {
            include: [
                {
                    model: GamePlayer,
                    as: "players",
                    attributes: [
                        "playerId",
                        "ready",
                        "position"
                    ]
                }
                
            ],
            raw
        });
    }

    async update(id, data, options={}) {
        const game = await this.findById(id, false)
        if(!game) return null;

        if(data.title) game.title = data.title;
        if(data.status) game.status = data.status;
        if(data.maxPlayers) game.maxPlayers = data.maxPlayers;
        if(data.topDiscardCardId) game.topDiscardCardId = data.topDiscardCardId;
        await game.save(options)

        return game.dataValues
    }

    async delete(game) {
        return await game.destroy();
    }
}

module.exports = new GameRepository();