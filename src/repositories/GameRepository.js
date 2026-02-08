const Game = require("../models/Game.js");
const GamePlayer = require("../models/GamePlayer.js")

class GameRepository {
    async create(data) {
        return await Game.create(data);
    }

    async findAll() {
        return await Game.findAll();
    }

    async findById(id) {
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
                
            ]
        });
    }

    async update(game, data) {
        // O Sequelize atualiza a instância e salva
        return await game.update(data);
    }

    async delete(game) {
        return await game.destroy();
    }
}

module.exports = new GameRepository();