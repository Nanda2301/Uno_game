const GameRepository = require('../repositories/GameRepository');
const Game = require('../models/Game');
const sequelize = require('../database');

describe('GameRepository', () => {
    beforeAll(async () => {
        await sequelize.sync({ force: true });
    });

    it('Deve criar um novo jogo', async () => {
        const game = await GameRepository.create({ status: 'waiting' });
        expect(game.id).toBeDefined();
        expect(game.status).toBe('waiting');
    });

    it('Deve listar todos os jogos', async () => {
        await Game.create({ status: 'finished' });
        const games = await GameRepository.findAll();
        expect(games.length).toBeGreaterThan(0);
    });
});