const CardController = require('../controllers/CardController');
const cardService = require('../services/CardService');

jest.mock('../services/CardService');

describe('CardController', () => {

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
        it('should create card successfully', async () => {
            const mockCard = { id: 1, color: 'red' };
            req.body = mockCard;

            cardService.create.mockResolvedValue(mockCard);

            await CardController.create(req, res, next);

            expect(cardService.create).toHaveBeenCalledWith(mockCard);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(mockCard);
        });

        it('should call next on error', async () => {
            const error = new Error('Erro');
            cardService.create.mockRejectedValue(error);

            await CardController.create(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('findAll', () => {
        it('should return all cards', async () => {
            const mockCards = [{ id: 1 }, { id: 2 }];
            cardService.findAll.mockResolvedValue(mockCards);

            await CardController.findAll(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockCards);
        });

        it('should call next on error', async () => {
            const error = new Error('Erro');
            cardService.findAll.mockRejectedValue(error);

            await CardController.findAll(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('getById', () => {
        it('should return card when found', async () => {
            req.params.id = 1;
            const mockCard = { id: 1 };

            cardService.findById.mockResolvedValue(mockCard);

            await CardController.getById(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockCard);
        });

        it('should return 404 when card not found', async () => {
            req.params.id = 999;

            cardService.findById.mockResolvedValue(null);

            await CardController.getById(req, res, next);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: "Card not found" });
        });

        it('should call next on error', async () => {
            req.params.id = 1;
            const error = new Error('Erro');

            cardService.findById.mockRejectedValue(error);

            await CardController.getById(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('update', () => {
        it('should update card successfully', async () => {
            req.params.id = 1;
            req.body = { pile: 'discard' };

            const updated = { id: 1, pile: 'discard' };
            cardService.update.mockResolvedValue(updated);

            await CardController.update(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(updated);
        });

        it('should return 404 if card not found', async () => {
            req.params.id = 999;

            cardService.update.mockResolvedValue(null);

            await CardController.update(req, res, next);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: "Card not found" });
        });

        it('should call next on error', async () => {
            req.params.id = 1;
            const error = new Error('Erro');

            cardService.update.mockRejectedValue(error);

            await CardController.update(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('delete', () => {
        it('should delete card successfully', async () => {
            req.params.id = 1;

            cardService.delete.mockResolvedValue(true);

            await CardController.delete(req, res, next);

            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.send).toHaveBeenCalled();
        });

        it('should return 404 if card not found', async () => {
            req.params.id = 999;

            cardService.delete.mockResolvedValue(null);

            await CardController.delete(req, res, next);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: "Card not found" });
        });

        it('should call next on error', async () => {
            req.params.id = 1;
            const error = new Error('Erro');

            cardService.delete.mockRejectedValue(error);

            await CardController.delete(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });
});
