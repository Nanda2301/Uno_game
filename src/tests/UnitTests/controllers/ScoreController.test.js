const ScoreController = require("../../../../src/controllers/ScoreController");
const scoreService = require("../../../../src/services/ScoreService");

jest.mock("../../../../src/services/ScoreService");

describe("ScoreController", () => {

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
    req = { body: {}, params: {} };
    res = mockResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  // CREATE

  it("create → sucesso", async () => {

    const result = { id: 1 };

    scoreService.create.mockResolvedValue({
      ok: true,
      status: 200,
      value: result
    });

    await ScoreController.create(req, res, next);

    expect(scoreService.create).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(result);
  });

  it("create → erro", async () => {

    const error = { ok: false, status: 400 };

    scoreService.create.mockResolvedValue(error);

    await ScoreController.create(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  // FIND ALL

  it("findAll → sucesso", async () => {

    const scores = [{ id: 1 }];

    scoreService.findAll.mockResolvedValue({
      ok: true,
      status: 200,
      value: scores
    });

    await ScoreController.findAll(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(scores);
  });

  it("findAll → erro", async () => {

    const error = { ok: false };

    scoreService.findAll.mockResolvedValue(error);

    await ScoreController.findAll(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  // GET BY ID

  it("getById → sucesso", async () => {

    req.params.id = 1;

    const score = { id: 1 };

    scoreService.findById.mockResolvedValue({
      ok: true,
      status: 200,
      value: score
    });

    await ScoreController.getById(req, res, next);

    expect(scoreService.findById).toHaveBeenCalledWith(1);
    expect(res.json).toHaveBeenCalledWith(score);
  });

  it("getById → erro", async () => {

    const error = { ok: false };

    scoreService.findById.mockResolvedValue(error);

    await ScoreController.getById(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  // UPDATE

  it("update → sucesso", async () => {

    req.params.id = 1;

    const updated = { id: 1 };

    scoreService.update.mockResolvedValue({
      ok: true,
      status: 200,
      value: updated
    });

    await ScoreController.update(req, res, next);

    expect(scoreService.update).toHaveBeenCalledWith(1, req.body);
    expect(res.json).toHaveBeenCalledWith(updated);
  });

  it("update → erro", async () => {

    const error = { ok: false };

    scoreService.update.mockResolvedValue(error);

    await ScoreController.update(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  // RANKING GERAL

  it("obterRanking → sucesso", async () => {

    const ranking = [{ player: "A" }];

    scoreService.obterRankingGeral.mockResolvedValue({
      ok: true,
      status: 200,
      value: ranking
    });

    await ScoreController.obterRanking(req, res, next);

    expect(res.json).toHaveBeenCalledWith(ranking);
  });

  it("obterRanking → erro", async () => {

    const error = { ok: false };

    scoreService.obterRankingGeral.mockResolvedValue(error);

    await ScoreController.obterRanking(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  // TOP 10

  it("obterTop10 → sucesso", async () => {

    const top = [{ player: "A" }];

    scoreService.obterTop10.mockResolvedValue({
      ok: true,
      status: 200,
      value: top
    });

    await ScoreController.obterTop10(req, res, next);

    expect(res.json).toHaveBeenCalledWith(top);
  });

  it("obterTop10 → erro", async () => {

    const error = { ok: false };

    scoreService.obterTop10.mockResolvedValue(error);

    await ScoreController.obterTop10(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  // ESTATISTICAS JOGADOR

  it("obterEstatisticasJogador → sucesso", async () => {

    req.params.playerId = "5";

    const stats = { wins: 10 };

    scoreService.obterEstatisticasJogador.mockResolvedValue({
      ok: true,
      status: 200,
      value: stats
    });

    await ScoreController.obterEstatisticasJogador(req, res, next);

    expect(scoreService.obterEstatisticasJogador).toHaveBeenCalledWith(5);
    expect(res.json).toHaveBeenCalledWith(stats);
  });

  it("obterEstatisticasJogador → erro", async () => {

    const error = { ok: false };

    scoreService.obterEstatisticasJogador.mockResolvedValue(error);

    await ScoreController.obterEstatisticasJogador(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  // DELETE

  it("delete → sucesso", async () => {

    req.params.id = 1;

    const result = { message: "deleted" };

    scoreService.delete.mockResolvedValue({
      ok: true,
      status: 200,
      value: result
    });

    await ScoreController.delete(req, res, next);

    expect(scoreService.delete).toHaveBeenCalledWith(1);
    expect(res.json).toHaveBeenCalledWith(result);
  });

  it("delete → erro", async () => {

    const error = { ok: false };

    scoreService.delete.mockResolvedValue(error);

    await ScoreController.delete(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

});