const APIUsageLogService = require("../../../services/APIUsageLogService");
const APIUsageLog = require("../../../models/APIUsageLog");

jest.mock("../../../models/APIUsageLog");

describe("APIUsageLogService", () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("register", () => {

    test("deve registrar log com sucesso", async () => {

      const logData = {
        responseTime: 120,
        endpointAccess: "/users",
        requestMethod: "GET",
        statusCode: 200,
        timestamp: new Date(),
        userId: 1
      };

      APIUsageLog.create.mockResolvedValue({
        dataValues: logData
      });

      const result = await APIUsageLogService.register(logData);

      expect(result.ok).toBe(true);
      expect(result.value.endpointAccess).toBe("/users");
    });

    test("deve retornar erro se ocorrer exceção", async () => {

      APIUsageLog.create.mockRejectedValue(new Error("DB error"));

      const result = await APIUsageLogService.register({});

      expect(result.ok).toBe(false);
      expect(result.error).toBeInstanceOf(Error);
    });

  });

  describe("countRequest", () => {

    test("deve contar requisições por endpoint e método", async () => {

      const logs = [
        { endpointAccess: "/users", requestMethod: "GET" },
        { endpointAccess: "/users", requestMethod: "GET" },
        { endpointAccess: "/users", requestMethod: "POST" },
        { endpointAccess: "/games", requestMethod: "GET" }
      ];

      APIUsageLog.findAll.mockResolvedValue(logs);

      const result = await APIUsageLogService.countRequest();

      expect(result.ok).toBe(true);
      expect(result.value.total_requests).toBe(4);
      expect(result.value.breakdown["/users"].GET).toBe(2);
      expect(result.value.breakdown["/users"].POST).toBe(1);
    });

    test("deve retornar erro se findAll falhar", async () => {

      APIUsageLog.findAll.mockRejectedValue(new Error("DB error"));

      const result = await APIUsageLogService.countRequest();

      expect(result.ok).toBe(false);
    });

  });

  describe("countStatusCode", () => {

    test("deve contar status HTTP", async () => {

      const logs = [
        { statusCode: 200 },
        { statusCode: 200 },
        { statusCode: 404 }
      ];

      APIUsageLog.findAll.mockResolvedValue(logs);

      const result = await APIUsageLogService.countStatusCode();

      expect(result.ok).toBe(true);
      expect(result.value[200]).toBe(2);
      expect(result.value[404]).toBe(1);
    });

  });

  describe("mostPopularEndpoint", () => {

    test("deve retornar endpoint mais acessado", async () => {

      const dbResponse = {
        most_popular: "/users",
        request_count: 10
      };

      APIUsageLog.findOne.mockResolvedValue(dbResponse);

      const result = await APIUsageLogService.mostPopularEndpoint();

      expect(result.ok).toBe(true);
      expect(result.value.most_popular).toBe("/users");
      expect(result.value.request_count).toBe(10);
    });

    test("deve retornar erro se consulta falhar", async () => {

      APIUsageLog.findOne.mockRejectedValue(new Error("DB error"));

      const result = await APIUsageLogService.mostPopularEndpoint();

      expect(result.ok).toBe(false);
    });

  });

  describe("requestResponseTime", () => {

    test("deve calcular estatísticas de tempo de resposta", async () => {

      const logs = [
        { endpoint: "/users", avg: 100, min: 50, max: 200 },
        { endpoint: "/games", avg: 120, min: 80, max: 300 }
      ];

      APIUsageLog.findAll.mockResolvedValue(logs);

      const result = await APIUsageLogService.requestResponseTime();

      expect(result.ok).toBe(true);

      expect(result.value["/users"]).toEqual({
        avg: 100,
        min: 50,
        max: 200
      });

      expect(result.value["/games"]).toEqual({
        avg: 120,
        min: 80,
        max: 300
      });
    });

    test("deve retornar erro se consulta falhar", async () => {

      APIUsageLog.findAll.mockRejectedValue(new Error("DB error"));

      const result = await APIUsageLogService.requestResponseTime();

      expect(result.ok).toBe(false);
    });

  });

});