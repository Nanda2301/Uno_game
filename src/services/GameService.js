const GameRepository = require("../repositories/GameRepository");

class GameService {
    async create(data) {
        return await GameRepository.create(data);
    }

    async findAll() {
        return await GameRepository.findAll();
    }

    async findById(id) {
        return await GameRepository.findById(id);
    }

    async update(id, data) {
        const game = await GameRepository.findById(id);
        if (!game) return null; // Retorna nulo se não encontrar

        return await GameRepository.update(game, data);
    }

    async delete(id) {
        const game = await GameRepository.findById(id);
        if (!game) return null;

        await GameRepository.delete(game);
        return true;
    }
}

module.exports = new GameService();