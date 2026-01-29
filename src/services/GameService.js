const GameRepository = require("../repositories/GameRepository");
const CardService = require('./CardService');

class GameService {
    async create(gameData) {
        // Cria o jogo no banco
        const game = await GameRepository.create(gameData);

        // Gera as cartas para o jogo automaticamente
        const cardService = new CardService();
        await cardService.createDeck(game.id);

        return game;
    }

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