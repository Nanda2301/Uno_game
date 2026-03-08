const StatisticController = require("../../../../src/controllers/StatisticController");
const ApiUsageLogService = require("../../../../src/services/APIUsageLogService");

jest.mock("../../../../src/services/APIUsageLogService");

describe("StatisticController", () => {

  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {};
    res = mockResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  // ======================
  // requestStatistics
  // ======================

  it("requestStatistics → sucesso", async () => {

    const value = { total: 100 };

    ApiUsageLogService.countRequest.mockResolvedValue({
      ok: true,
      status: 200,
      value
    });

    await StatisticController.requestStatistics(req, res, next);

    expect(ApiUsageLogService.countRequest).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(value);
  });

  it("requestStatistics → erro", async () => {

    const error = { ok: false };

    ApiUsageLogService.countRequest.mockResolvedValue(error);

    await StatisticController.requestStatistics(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  // ======================
  // requestStatusStatistics
  // ======================

  it("requestStatusStatistics → sucesso", async () => {

    const value = { "200": 50 };

    ApiUsageLogService.countStatusCode.mockResolvedValue({
      ok: true,
      status: 200,
      value
    });

    await StatisticController.requestStatusStatistics(req, res, next);

    expect(ApiUsageLogService.countStatusCode).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(value);
  });

  it("requestStatusStatistics → erro", async () => {

    const error = { ok: false };

    ApiUsageLogService.countStatusCode.mockResolvedValue(error);

    await StatisticController.requestStatusStatistics(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  // ======================
  // mostPopularEndpoint
  // ======================

  it("mostPopularEndpoint → sucesso", async () => {

    const value = { endpoint: "/api/cards" };

    ApiUsageLogService.mostPopularEndpoint.mockResolvedValue({
      ok: true,
      status: 200,
      value
    });

    await StatisticController.mostPopularEndpoint(req, res, next);

    expect(ApiUsageLogService.mostPopularEndpoint).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(value);
  });

  it("mostPopularEndpoint → erro", async () => {

    const error = { ok: false };

    ApiUsageLogService.mostPopularEndpoint.mockResolvedValue(error);

    await StatisticController.mostPopularEndpoint(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  // ======================
  // ResponseTimeStatistics
  // ======================

  it("ResponseTimeStatistics → sucesso", async () => {

    const value = { avg: 120 };

    ApiUsageLogService.requestResponseTime.mockResolvedValue({
      ok: true,
      status: 200,
      value
    });

    await StatisticController.ResponseTimeStatistics(req, res, next);

    expect(ApiUsageLogService.requestResponseTime).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(value);
  });

  it("ResponseTimeStatistics → erro", async () => {

    const error = { ok: false };

    ApiUsageLogService.requestResponseTime.mockResolvedValue(error);

    await StatisticController.ResponseTimeStatistics(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

});