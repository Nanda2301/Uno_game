const GameService = require('../services/GameService');
const GameRepository = require('../repositories/GameRepository');
const GamePlayerRepository = require('../repositories/GamePlayerRepository');
const CardService = require('../services/CardService');

jest.mock('../repositories/GameRepository');
jest.mock('../repositories/GamePlayerRepository');
jest.mock('../services/CardService');

describe('GameService - Operações CRUD de Jogos', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('deve criar um jogo corretamente, adicionar o criador e gerar o baralho', async () => {
            const gameData = { title: 'Mesa UNO', maxPlayers: 4 };
            const creatorId = 1;
            const mockGame = { 
                id: 100, 
                ...gameData, 
                creatorId, 
                status: 'waiting' 
            };

            GameRepository.create.mockResolvedValue(mockGame);
            GamePlayerRepository.create.mockResolvedValue(true);
            CardService.createDeck.mockResolvedValue(true);

            const result = await GameService.create(gameData, creatorId);

            expect(GameRepository.create).toHaveBeenCalledWith({
                ...gameData,
                creatorId,
                status: 'waiting'
            });

            expect(GamePlayerRepository.create).toHaveBeenCalledWith({
                gameId: mockGame.id,
                playerId: creatorId,
                ready: true,
                position: 1
            });

            expect(CardService.createDeck).toHaveBeenCalledWith(mockGame.id);
            expect(result).toEqual(mockGame);
        });

        it('deve lançar erro se o Creator ID não for fornecido', async () => {
            await expect(GameService.create({ title: 'Teste' }, null))
                .rejects
                .toThrow('Creator ID é obrigatório');
        });
    });

    describe('findAll', () => {
        it('deve retornar uma lista de jogos', async () => {
            const mockGames = [
                { id: 1, title: 'Game 1' },
                { id: 2, title: 'Game 2' }
            ];
            GameRepository.findAll.mockResolvedValue(mockGames);

            const result = await GameService.findAll();

            expect(result).toEqual(mockGames);
            expect(GameRepository.findAll).toHaveBeenCalled();
        });
    });

    describe('findById', () => {
        it('deve retornar um jogo pelo ID', async () => {
            const mockGame = { id: 1, title: 'Game 1' };
            GameRepository.findById.mockResolvedValue(mockGame);

            const result = await GameService.findById(1);

            expect(result).toEqual(mockGame);
            expect(GameRepository.findById).toHaveBeenCalledWith(1);
        });

        it('deve retornar null/undefined se o jogo não existir', async () => {
            GameRepository.findById.mockResolvedValue(null);

            const result = await GameService.findById(999);

            expect(result).toBeNull();
        });
    });

    describe('update', () => {
        it('deve atualizar um jogo existente', async () => {
            const gameId = 1;
            const updateData = { status: 'in_progress' };
            const mockGame = { id: gameId, title: 'Old Title', status: 'waiting' };
            const updatedGame = { ...mockGame, ...updateData };

            GameRepository.findById.mockResolvedValue(mockGame);
            GameRepository.update.mockResolvedValue(updatedGame);

            const result = await GameService.update(gameId, updateData);

            expect(GameRepository.findById).toHaveBeenCalledWith(gameId);
            expect(GameRepository.update).toHaveBeenCalledWith(mockGame, updateData);
            expect(result).toEqual(updatedGame);
        });

        it('deve retornar null se tentar atualizar um jogo inexistente', async () => {
            GameRepository.findById.mockResolvedValue(null);

            const result = await GameService.update(999, { status: 'finished' });

            expect(result).toBeNull();
            expect(GameRepository.update).not.toHaveBeenCalled();
        });
    });

    describe('delete', () => {
        it('deve deletar um jogo existente', async () => {
            const gameId = 1;
            const mockGame = { id: gameId, title: 'To Delete' };

            GameRepository.findById.mockResolvedValue(mockGame);
            GameRepository.delete.mockResolvedValue(true);

            const result = await GameService.delete(gameId);

            expect(GameRepository.findById).toHaveBeenCalledWith(gameId);
            expect(GameRepository.delete).toHaveBeenCalledWith(mockGame);
            expect(result).toBe(true);
        });

        it('deve retornar null se tentar deletar um jogo inexistente', async () => {
            GameRepository.findById.mockResolvedValue(null);

            const result = await GameService.delete(999);

            expect(result).toBeNull();
            expect(GameRepository.delete).not.toHaveBeenCalled();
        });
    });

});