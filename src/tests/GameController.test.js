const GameController = require('../controllers/GameController');
const gameService = require('../services/GameService');

jest.mock('../services/GameService');

describe('GameController', () => {

    let req;
    let res;
    let next;

    beforeEach(() => {
        req = {
            body: {},
            params: {},
            userId: null
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
        it('should create game successfully', async () => {
            req.userId = 1;
            req.body = { name: 'Game 1' };

            const mockGame = { id: 10, ...req.body };
            gameService.create.mockResolvedValue(mockGame);

            await GameController.create(req, res, next);

            expect(gameService.create).toHaveBeenCalledWith(req.body, 1);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(mockGame);
        });

        it('should return 400 if creatorId missing', async () => {
            await GameController.create(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
        });
    });

    describe('findAll', () => {
        it('should return all games', async () => {
            const games = [{ id: 1 }];
            gameService.findAll.mockResolvedValue(games);

            await GameController.findAll(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(games);
        });
    });

    describe('getById', () => {
        it('should return game when found', async () => {
            req.params.id = 1;
            const game = { id: 1 };
            gameService.findById.mockResolvedValue(game);

            await GameController.getById(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('should return 404 when not found', async () => {
            req.params.id = 999;
            gameService.findById.mockResolvedValue(null);

            await GameController.getById(req, res, next);

            expect(res.status).toHaveBeenCalledWith(404);
        });
    });

    describe('adicionarJogador', () => {
        it('should add player successfully', async () => {
            req.params.id = 1;
            req.userId = 2;

            const result = { success: true };
            gameService.adicionarJogador.mockResolvedValue(result);

            await GameController.adicionarJogador(req, res, next);

            expect(res.status).toHaveBeenCalledWith(201);
        });

        it('should return 400 if playerId missing', async () => {
            req.params.id = 1;

            await GameController.adicionarJogador(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
        });

        it('should return 400 if service returns error', async () => {
            req.params.id = 1;
            req.userId = 2;

            gameService.adicionarJogador.mockResolvedValue({ error: 'Erro' });

            await GameController.adicionarJogador(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
        });
    });

    describe('marcarPronto', () => {
        it('should mark ready successfully', async () => {
            req.params.id = 1;
            req.userId = 2;

            const result = { success: true };
            gameService.marcarPronto.mockResolvedValue(result);

            await GameController.marcarPronto(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('should return 400 if playerId missing', async () => {
            req.params.id = 1;

            await GameController.marcarPronto(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
        });

        it('should return 400 if service returns error', async () => {
            req.params.id = 1;
            req.userId = 2;

            gameService.marcarPronto.mockResolvedValue({ error: 'Erro' });

            await GameController.marcarPronto(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
        });
    });

    describe('iniciarJogo', () => {
        it('should start game successfully', async () => {
            req.params.id = 1;
            req.userId = 5;

            gameService.iniciarJogo.mockResolvedValue({ started: true });

            await GameController.iniciarJogo(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('should return 401 if no user', async () => {
            req.params.id = 1;

            await GameController.iniciarJogo(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
        });

        it('should return 403 if service returns error', async () => {
            req.params.id = 1;
            req.userId = 5;

            gameService.iniciarJogo.mockResolvedValue({ error: 'Não permitido' });

            await GameController.iniciarJogo(req, res, next);

            expect(res.status).toHaveBeenCalledWith(403);
        });
    });

    describe('finalizarJogo', () => {
        it('should finish game successfully', async () => {
            req.params.id = 1;
            req.userId = 5;

            gameService.finalizarJogo.mockResolvedValue({ finished: true });

            await GameController.finalizarJogo(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('should return 401 if no user', async () => {
            req.params.id = 1;

            await GameController.finalizarJogo(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
        });

        it('should return 403 if service returns error', async () => {
            req.params.id = 1;
            req.userId = 5;

            gameService.finalizarJogo.mockResolvedValue({ error: 'Não permitido' });

            await GameController.finalizarJogo(req, res, next);

            expect(res.status).toHaveBeenCalledWith(403);
        });
    });

    describe('update', () => {
        it('should update game successfully', async () => {
            req.params.id = 1;
            req.body = { name: 'Updated' };

            const updated = { id: 1, name: 'Updated' };
            gameService.update.mockResolvedValue(updated);

            await GameController.update(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('should return 404 if not found', async () => {
            req.params.id = 999;
            gameService.update.mockResolvedValue(null);

            await GameController.update(req, res, next);

            expect(res.status).toHaveBeenCalledWith(404);
        });
    });

    describe('delete', () => {
        it('should delete game successfully', async () => {
            req.params.id = 1;
            gameService.delete.mockResolvedValue(true);

            await GameController.delete(req, res, next);

            expect(res.status).toHaveBeenCalledWith(204);
        });

        it('should return 404 if not found', async () => {
            req.params.id = 999;
            gameService.delete.mockResolvedValue(null);

            await GameController.delete(req, res, next);

            expect(res.status).toHaveBeenCalledWith(404);
        });
    });
});
