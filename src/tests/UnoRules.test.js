const GameService = require('../services/GameService');
const GameRepository = require('../repositories/GameRepository');
const GamePlayerRepository = require('../repositories/GamePlayerRepository');
const CardService = require('../services/CardService');

jest.mock('../repositories/GameRepository');
jest.mock('../repositories/GamePlayerRepository');
jest.mock('../services/CardService');

describe('Testes de Regras de Negócio - UNO', () => {

    const gameId = 1;
    const playerId = 10;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // TESTE - REGRA DO SKIP
    test('Deve pular o próximo jogador e atualizar a posição corretamente (Skip)', async () => {

        const mockGame = {
            id: gameId,
            currentPlayerPosition: 1,
            direction: 1
        };

        const mockPlayers = [
            { id: 1 },
            { id: 2 },
            { id: 3 },
            { id: 4 }
        ];

        GameRepository.findById.mockResolvedValue(mockGame);
        GamePlayerRepository.findByGameId.mockResolvedValue(mockPlayers);
        GameRepository.update.mockResolvedValue(true);

        await GameService.aplicarPular(gameId);

        expect(GameRepository.findById).toHaveBeenCalledWith(gameId);
        expect(GamePlayerRepository.findByGameId).toHaveBeenCalledWith(gameId);
        expect(GameRepository.update).toHaveBeenCalled();
    });

    // TESTE - REGRA DE COMPRA
    test('Deve validar que o jogador só compra se tiver carta jogável', async () => {

        const topo = { id: 99, color: 'red', value: '5' };

        const maoDoJogador = [
            { color: 'red', value: '9' }, 
            { color: 'blue', value: '2' }
        ];

        GameRepository.findById.mockResolvedValue({
            id: gameId,
            topDiscardCardId: 99
        });

        CardService.seePlayerCards.mockResolvedValue(maoDoJogador);
        CardService.findById.mockResolvedValue(topo);

        const resultado = await GameService.comprarSeNaoPuderJogar(gameId, playerId);

        expect(resultado.error).toBe('Você possui cartas que podem ser jogadas');
    });

});