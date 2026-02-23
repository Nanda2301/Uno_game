const errorMiddleware = require('../middlewares/errorMiddleware');

describe('Error Middleware', () => {

    test('deve retornar status 500', () => {

        const err = new Error('Falha');

        const req = {
            method: 'GET',
            originalUrl: '/test',
            body: {}
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        const next = jest.fn();

        errorMiddleware(err, req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalled();
    });
});