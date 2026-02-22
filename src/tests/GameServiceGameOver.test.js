const gameService = require('../services/GameService');
const GamePlayerRepository = require('../repositories/GamePlayerRepository');
const GameRepository = require('../repositories/GameRepository');

jest.mock('../repositories/GamePlayerRepository');
jest.mock('../repositories/GameRepository');

describe('GameService - checkGameOver', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        gameService.calculateCardScore = (card) => 1; 
    });

    it('deve declarar o vencedor e somar 1 ponto por carta', async () => {
        const players = [
            { playerName: 'Player1', hand: [] },
            { playerName: 'Player2', hand: ['Red 3', 'Blue 5'] }
        ];

        GamePlayerRepository.findByGameId.mockResolvedValue(players);
        GameRepository.update.mockResolvedValue(true);

        const result = await gameService.checkGameOver(1);

        expect(result.winner).toBe('Player1');
        expect(result.scores['Player2']).toBe(2);
    });
});