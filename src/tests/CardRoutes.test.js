const request = require('supertest');
const express = require('express');

jest.mock('../services/CardService', () => ({
    getPlayerHand: jest.fn()
}));

const cardService = require('../services/CardService');

jest.mock('../middlewares/auth.middleware', () => (req, res, next) => {
    req.user = { id: 1, name: 'TestPlayer' };
    next();
});

const router = require('../routes/CardRoutes');

const app = express();
app.use(express.json());
app.use('/cards', router);

describe('GET /cards/my-cards', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve retornar as cartas do jogador logado', async () => {
        const mockHand = ["Red 3", "Blue Skip"];

        cardService.getPlayerHand.mockResolvedValue(mockHand);

        const response = await request(app).get('/cards/my-cards');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            player: 'TestPlayer',
            hand: mockHand
        });
    });
});
