jest.mock('../services/GameService', () => ({
    getFullStatus: jest.fn()
}));

const gameController = require('../controllers/GameController');
const gameService = require('../services/GameService');

describe('GameController - getStatus', () => {
    let req, res;

    beforeEach(() => {
        req = { params: { id: '123' } };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        jest.clearAllMocks();
    });

    it('deve retornar status 200 e os dados do jogo', async () => {
        const mockStatus = {
            currentPlayer: 'Player1',
            topCard: 'Red 7'
        };

        gameService.getFullStatus.mockResolvedValue(mockStatus);

        await gameController.getStatus(req, res);

        expect(gameService.getFullStatus).toHaveBeenCalledWith('123');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockStatus);
    });
});