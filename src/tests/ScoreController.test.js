const ScoreController = require('../controllers/ScoreController');
const scoreService = require('../services/ScoreService');

jest.mock('../services/ScoreService');

describe('ScoreController', () => {

    let req;
    let res;
    let next;

    beforeEach(() => {
        req = {
            body: {},
            params: {}
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn()
        };

        next = jest.fn();

        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create a score successfully', async () => {
            const mockScore = { id: 1, points: 100 };
            scoreService.create.mockResolvedValue(mockScore);

            req.body = { points: 100 };

            await ScoreController.create(req, res, next);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(mockScore);
        });

        it('should return 400 if error contains "incompletos"', async () => {
            const error = new Error('Dados incompletos');
            scoreService.create.mockRejectedValue(error);

            await ScoreController.create(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: error.message });
        });

        it('should call next on unexpected error', async () => {
            const error = new Error('Erro inesperado');
            scoreService.create.mockRejectedValue(error);

            await ScoreController.create(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('findAll', () => {
        it('should return all scores', async () => {
            const mockScores = [{ id: 1 }, { id: 2 }];
            scoreService.findAll.mockResolvedValue(mockScores);

            await ScoreController.findAll(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockScores);
        });
    });

    describe('getById', () => {
        it('should return score when found', async () => {
            const mockScore = { id: 1 };
            req.params.id = 1;

            scoreService.findById.mockResolvedValue(mockScore);

            await ScoreController.getById(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockScore);
        });

        it('should return 404 when not found', async () => {
            req.params.id = 999;

            scoreService.findById.mockResolvedValue(null);

            await ScoreController.getById(req, res, next);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: "Score not found" });
        });
    });

    describe('obterRanking', () => {
        it('should return ranking', async () => {
            const mockRanking = [{ player: 'A', points: 200 }];
            scoreService.obterRankingGeral.mockResolvedValue(mockRanking);

            await ScoreController.obterRanking(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockRanking);
        });
    });

    describe('obterTop10', () => {
        it('should return top 10', async () => {
            const mockTop10 = [{ player: 'B', points: 300 }];
            scoreService.obterTop10.mockResolvedValue(mockTop10);

            await ScoreController.obterTop10(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockTop10);
        });
    });

    describe('obterEstatisticasJogador', () => {
        it('should return player stats', async () => {
            req.params.playerId = "5";

            const mockStats = { totalGames: 10 };
            scoreService.obterEstatisticasJogador.mockResolvedValue(mockStats);

            await ScoreController.obterEstatisticasJogador(req, res, next);

            expect(scoreService.obterEstatisticasJogador).toHaveBeenCalledWith(5);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockStats);
        });
    });

    describe('update', () => {
        it('should update score successfully', async () => {
            req.params.id = 1;
            req.body = { points: 150 };

            const updated = { id: 1, points: 150 };
            scoreService.update.mockResolvedValue(updated);

            await ScoreController.update(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(updated);
        });

        it('should return 404 if score not found', async () => {
            req.params.id = 999;

            scoreService.update.mockResolvedValue(null);

            await ScoreController.update(req, res, next);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: "Score not found" });
        });
    });

    describe('delete', () => {
        it('should delete score successfully', async () => {
            req.params.id = 1;

            scoreService.delete.mockResolvedValue(true);

            await ScoreController.delete(req, res, next);

            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.send).toHaveBeenCalled();
        });

        it('should return 404 if score not found', async () => {
            req.params.id = 999;

            scoreService.delete.mockResolvedValue(null);

            await ScoreController.delete(req, res, next);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: "Score not found" });
        });
    });
});
