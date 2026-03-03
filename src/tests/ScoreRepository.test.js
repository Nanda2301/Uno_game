const ScoreRepository = require('../repositories/ScoreRepository');
const Score = require('../models/Score');
const sequelize = require('../database');

describe('ScoreRepository', () => {
    beforeAll(async () => {
        await sequelize.sync({ force: true });
    });

    it('Deve gerenciar scores (CRUD)', async () => {
        const scoreData = { playerId: 1, gameId: 1, score: 100 };
        const score = await ScoreRepository.create(scoreData);
        expect(score.score).toBe(100);

        // Update
        await ScoreRepository.update(score, { score: 150 });
        expect(score.score).toBe(150);

        // Delete
        await ScoreRepository.delete(score);
        const found = await Score.findByPk(score.id);
        expect(found).toBeNull();
    });
});