const ScoreService = require('../services/ScoreService');
const ScoreRepository = require('../repositories/ScoreRepository');

jest.mock('../repositories/ScoreRepository');

describe('ScoreService - Operações CRUD de Pontuação', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('deve registrar uma nova pontuação com sucesso', async () => {
            const scoreData = { playerId: 1, gameId: 10, score: 50 };
            const mockScore = { id: 1, ...scoreData, createdAt: new Date() };

            ScoreRepository.create.mockResolvedValue(mockScore);

            const result = await ScoreService.create(scoreData);

            expect(ScoreRepository.create).toHaveBeenCalledWith(scoreData);
            expect(result).toEqual(mockScore);
        });
    });

    describe('findAll', () => {
        it('deve retornar todas as pontuações históricas', async () => {
            const mockScores = [
                { id: 1, score: 100 },
                { id: 2, score: 200 }
            ];
            ScoreRepository.findAll.mockResolvedValue(mockScores);

            const result = await ScoreService.findAll();

            expect(result).toEqual(mockScores);
            expect(ScoreRepository.findAll).toHaveBeenCalled();
        });
    });

    describe('findById', () => {
        it('deve retornar uma pontuação específica pelo ID', async () => {
            const mockScore = { id: 1, score: 500 };
            ScoreRepository.findById.mockResolvedValue(mockScore);

            const result = await ScoreService.findById(1);

            expect(result).toEqual(mockScore);
            expect(ScoreRepository.findById).toHaveBeenCalledWith(1);
        });

        it('deve retornar null se a pontuação não existir', async () => {
            ScoreRepository.findById.mockResolvedValue(null);

            const result = await ScoreService.findById(999);

            expect(result).toBeNull();
        });
    });

    describe('update', () => {
        it('deve atualizar uma pontuação existente', async () => {
            const scoreId = 1;
            const updateData = { score: 150 }; 
            const mockScoreOriginal = { id: scoreId, score: 100, update: jest.fn() };
            const mockScoreAtualizado = { id: scoreId, score: 150 };

            ScoreRepository.findById.mockResolvedValue(mockScoreOriginal);
            
            ScoreRepository.update.mockResolvedValue(mockScoreAtualizado);

            const result = await ScoreService.update(scoreId, updateData);

            expect(ScoreRepository.findById).toHaveBeenCalledWith(scoreId);
            expect(ScoreRepository.update).toHaveBeenCalledWith(mockScoreOriginal, updateData);
            expect(result).toEqual(mockScoreAtualizado);
        });

        it('deve retornar null ao tentar atualizar pontuação inexistente', async () => {
            ScoreRepository.findById.mockResolvedValue(null);

            const result = await ScoreService.update(999, { score: 1000 });

            expect(result).toBeNull();
            expect(ScoreRepository.update).not.toHaveBeenCalled();
        });
    });

    describe('delete', () => {
        it('deve excluir uma pontuação existente', async () => {
            const scoreId = 1;
            const mockScore = { id: scoreId, score: 50 };

            ScoreRepository.findById.mockResolvedValue(mockScore);
            ScoreRepository.delete.mockResolvedValue(true);

            const result = await ScoreService.delete(scoreId);

            expect(ScoreRepository.findById).toHaveBeenCalledWith(scoreId);
            expect(ScoreRepository.delete).toHaveBeenCalledWith(mockScore);
            expect(result).toBe(true);
        });

        it('deve retornar null ao tentar excluir pontuação inexistente', async () => {
            ScoreRepository.findById.mockResolvedValue(null);

            const result = await ScoreService.delete(999);

            expect(result).toBeNull();
            expect(ScoreRepository.delete).not.toHaveBeenCalled();
        });
    });
});