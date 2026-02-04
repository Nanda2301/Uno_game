// Note que removemos o "src" e subimos apenas um nível
const GameService = require('../services/GameService');
const GameRepository = require('../repositories/GameRepository');
const GamePlayerRepository = require('../repositories/GamePlayerRepository');

jest.mock('../repositories/GameRepository');
jest.mock('../repositories/GamePlayerRepository');
jest.mock('../services/CardService');

describe('GameService - Player Management (CRUD)', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('adicionarJogador', () => {
        it('deve adicionar um jogador com sucesso se o jogo estiver aguardando e houver vaga', async () => {

            const gameId = 1;
            const playerId = 10;
            const mockGame = { id: gameId, status: 'waiting', maxPlayers: 4 };
            
            GameRepository.findById.mockResolvedValue(mockGame);
            GamePlayerRepository.findByGameId.mockResolvedValue([{ playerId: 99 }]); 
            GamePlayerRepository.create.mockResolvedValue({
                gameId,
                playerId,
                ready: false,
                position: 2
            });

        
            const result = await GameService.adicionarJogador(gameId, playerId);

            expect(result).toHaveProperty('playerId', 10);
            expect(result).toHaveProperty('position', 2);
            expect(GamePlayerRepository.create).toHaveBeenCalled();
        });

        it('não deve adicionar jogador se o jogo não existir', async () => {
            GameRepository.findById.mockResolvedValue(null);
            
            const result = await GameService.adicionarJogador(1, 10);
            
            expect(result).toEqual({ error: 'Jogo não encontrado' });
        });

        it('não deve adicionar jogador se o jogo já estiver cheio', async () => {
            const gameId = 1;
            const mockGame = { id: gameId, status: 'waiting', maxPlayers: 2 };
            
            GameRepository.findById.mockResolvedValue(mockGame);
            GamePlayerRepository.findByGameId.mockResolvedValue([{ playerId: 1 }, { playerId: 2 }]);

            const result = await GameService.adicionarJogador(gameId, 10);
            
            expect(result).toEqual({ error: 'Jogo já está cheio' });
        });

        it('não deve adicionar o mesmo jogador duas vezes', async () => {
            const gameId = 1;
            const playerId = 10;
            const mockGame = { id: gameId, status: 'waiting', maxPlayers: 4 };
            
            GameRepository.findById.mockResolvedValue(mockGame);
            GamePlayerRepository.findByGameId.mockResolvedValue([{ playerId: 10 }]);

            const result = await GameService.adicionarJogador(gameId, playerId);
            
            expect(result).toEqual({ error: 'Jogador já está nesta partida' });
        });
    });


    describe('marcarPronto', () => {
        it('deve marcar o jogador como pronto com sucesso', async () => {
            const gameId = 1;
            const playerId = 10;
            const mockPlayer = { gameId, playerId, ready: false };

            GamePlayerRepository.findOne.mockResolvedValue(mockPlayer);
            GamePlayerRepository.update.mockResolvedValue(true);

            const result = await GameService.marcarPronto(gameId, playerId);

            expect(GamePlayerRepository.update).toHaveBeenCalledWith(mockPlayer, { ready: true });
            expect(result).toEqual({ message: 'Jogador marcado como pronto' });
        });

        it('deve retornar erro se o jogador não estiver na partida', async () => {
            GamePlayerRepository.findOne.mockResolvedValue(null);

            const result = await GameService.marcarPronto(1, 999);

            expect(result).toEqual({ error: 'Jogador não está nesta partida' });
        });
    });

    describe('abandonarJogo', () => {
        it('deve remover o jogador com sucesso', async () => {
            const gameId = 1;
            const playerId = 10;
            const mockGame = { id: gameId, status: 'waiting', creatorId: 99, currentPlayerPosition: 1, direction: 1 };
            const mockPlayer = { playerId: 10, position: 2 };
            const mockOtherPlayer = { playerId: 99, position: 1 };

            GameRepository.findById.mockResolvedValue(mockGame);
            GamePlayerRepository.findOne.mockResolvedValue(mockPlayer);
            GamePlayerRepository.findByGameId.mockResolvedValue([mockOtherPlayer, mockPlayer]); // 2 jogadores na sala
            GamePlayerRepository.delete.mockResolvedValue(true);

            const result = await GameService.abandonarJogo(gameId, playerId);

            expect(GamePlayerRepository.delete).toHaveBeenCalledWith(mockPlayer);
            expect(result).toEqual({ message: 'Jogador abandonou a partida' });
        });

        it('deve transferir a liderança (creatorId) se o criador sair', async () => {
            const gameId = 1;
            const creatorId = 10;
            const nextPlayerId = 20;

            const mockGame = { id: gameId, status: 'waiting', creatorId: creatorId, currentPlayerPosition: 1, direction: 1 };
            const mockCreator = { playerId: creatorId, position: 1 };
            const mockNextPlayer = { playerId: nextPlayerId, position: 2 };

            GameRepository.findById.mockResolvedValue(mockGame);
            GamePlayerRepository.findOne.mockResolvedValue(mockCreator);
            GamePlayerRepository.findByGameId.mockResolvedValue([mockCreator, mockNextPlayer]);
            
            await GameService.abandonarJogo(gameId, creatorId);

            expect(GameRepository.update).toHaveBeenCalledWith(mockGame, { creatorId: nextPlayerId });
        });

        it('deve finalizar o jogo por W.O. se sobrar apenas 1 jogador durante o progresso', async () => {
            const gameId = 1;
            const playerId = 10;
            
            const mockGame = { id: gameId, status: 'in_progress', creatorId: 99, currentPlayerPosition: 1, direction: 1 };
            const mockPlayerLeaving = { playerId: 10, position: 2 };
            const mockWinner = { playerId: 99, position: 1 };

            GameRepository.findById.mockResolvedValue(mockGame);
            GamePlayerRepository.findOne.mockResolvedValue(mockPlayerLeaving);
            GamePlayerRepository.findByGameId.mockResolvedValue([mockWinner, mockPlayerLeaving]); 

            await GameService.abandonarJogo(gameId, playerId);

            expect(GameRepository.update).toHaveBeenCalledWith(mockGame, { status: 'finished' });
        });
    });
});