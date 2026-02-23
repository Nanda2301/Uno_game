const createMemoizationMiddleware = require("../middlewares/memoizationMiddleware");

describe("Memoization Middleware", () => {
    let req, res, next, mockJson;

    beforeEach(() => {
        req = { method: "GET", originalUrl: "/api/test" };
        mockJson = jest.fn(); 
        res = { json: mockJson };
        next = jest.fn();
        
        jest.useFakeTimers(); 
    });

    afterEach(() => {
        jest.useRealTimers(); 
    });

    it("Deve ignorar requisições que não sejam GET", () => {
        const middleware = createMemoizationMiddleware({ max: 5, maxAge: 10000 });
        req.method = "POST";

        middleware(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(mockJson).not.toHaveBeenCalled();
    });

    it("Deve guardar a resposta no cache na primeira requisição (Cache Miss)", () => {
        const middleware = createMemoizationMiddleware({ max: 5, maxAge: 10000 });

        middleware(req, res, next);
        expect(next).toHaveBeenCalled();

        const mockData = { id: 1, name: "Teste" };
        res.json(mockData); 

        expect(mockJson).toHaveBeenCalledWith(mockData);
    });

    it("Deve retornar os dados do cache na segunda requisição (Cache Hit)", () => {
        const middleware = createMemoizationMiddleware({ max: 5, maxAge: 10000 });
        const mockData = { id: 1, name: "Teste" };

        middleware(req, res, next);
        res.json(mockData); 

        const req2 = { method: "GET", originalUrl: "/api/test" };
        const mockJson2 = jest.fn();
        const res2 = { json: mockJson2 };
        const next2 = jest.fn();

        middleware(req2, res2, next2);

        expect(next2).not.toHaveBeenCalled(); 
        expect(mockJson2).toHaveBeenCalledWith(mockData);
    });

    it("Deve remover entradas expiradas pelo maxAge", () => {
        const middleware = createMemoizationMiddleware({ max: 5, maxAge: 5000 });
        const mockData = { id: 1, name: "Teste" };

        middleware(req, res, next);
        res.json(mockData);

        jest.advanceTimersByTime(6000);

        const req2 = { method: "GET", originalUrl: "/api/test" };
        const mockJson2 = jest.fn();
        const res2 = { json: mockJson2 };
        const next2 = jest.fn();

        middleware(req2, res2, next2);

        expect(next2).toHaveBeenCalled();
    });

    it("Deve aplicar a política LRU quando o limite 'max' for atingido", () => {
        const middleware = createMemoizationMiddleware({ max: 2, maxAge: 50000 });

        const simularRequisicao = (url, body) => {
            const reqMock = { method: "GET", originalUrl: url };
            const jsonMock = jest.fn();
            const resMock = { json: jsonMock };
            const nextMock = jest.fn();

            middleware(reqMock, resMock, nextMock);

            if (nextMock.mock.calls.length > 0) {
                resMock.json(body);
            }
            return { nextMock };
        };

        simularRequisicao("/api/A", { data: "A" });
        jest.advanceTimersByTime(1000); 

        simularRequisicao("/api/B", { data: "B" });
        jest.advanceTimersByTime(1000); 

        simularRequisicao("/api/A", { data: "A" }); 
        jest.advanceTimersByTime(1000); 

        simularRequisicao("/api/C", { data: "C" });

        const { nextMock } = simularRequisicao("/api/B", { data: "B" });
        
        expect(nextMock).toHaveBeenCalled(); 
    });
});