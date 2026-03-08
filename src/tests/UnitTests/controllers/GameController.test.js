const GameController = require("../../../../src/controllers/GameController");
const GameService = require("../../../../src/services/GameService");

jest.mock("../../../../src/services/GameService");

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("GameController", () => {

  let res;
  let next;

  beforeEach(() => {
    res = mockResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  test("create sucesso", async () => {

    const req = { body: {}, userId: 1 };

    GameService.create.mockResolvedValue({
      ok: true,
      status: 201,
      value: { id: 1 }
    });

    await GameController.create(req, res, next);

    expect(GameService.create).toHaveBeenCalledWith({}, 1);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
  });

  test("create erro", async () => {

    const req = { body: {}, userId: 1 };

    GameService.create.mockResolvedValue({ ok: false });

    await GameController.create(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  test("findAll sucesso", async () => {

    GameService.findAll.mockResolvedValue({
      ok: true,
      status: 200,
      value: []
    });

    await GameController.findAll({}, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("getById sucesso", async () => {

    const req = { params: { id: 1 } };

    GameService.findById.mockResolvedValue({
      ok: true,
      status: 200,
      value: {}
    });

    await GameController.getById(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("adicionarJogador sucesso", async () => {

    const req = { params: { id: 1 }, userId: 2 };

    GameService.adicionarJogador.mockResolvedValue({
      ok: true,
      status: 200,
      value: {}
    });

    await GameController.adicionarJogador(req, res, next);

    expect(GameService.adicionarJogador).toHaveBeenCalledWith(1, 2);
  });

  test("marcarPronto sucesso", async () => {

    const req = { params: { id: 1 }, userId: 3 };

    GameService.marcarPronto.mockResolvedValue({
      ok: true,
      status: 200,
      value: {}
    });

    await GameController.marcarPronto(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("iniciarJogo sucesso", async () => {

    const req = { params: { id: 1 }, userId: 3 };

    GameService.iniciarJogo.mockResolvedValue({
      ok: true,
      status: 200,
      value: {}
    });

    await GameController.iniciarJogo(req, res, next);
  });

  test("finalizarJogo sucesso", async () => {

    const req = { params: { id: 1 }, userId: 3 };

    GameService.finalizarJogo.mockResolvedValue({
      ok: true,
      status: 200,
      value: {}
    });

    await GameController.finalizarJogo(req, res, next);
  });

  test("update sucesso", async () => {

    const req = { params: { id: 1 }, body: {} };

    GameService.update.mockResolvedValue({
      ok: true,
      status: 200,
      value: {}
    });

    await GameController.update(req, res, next);
  });

  test("delete sucesso", async () => {

    const req = { params: { id: 1 } };

    GameService.delete.mockResolvedValue({
      ok: true,
      status: 200,
      value: {}
    });

    await GameController.delete(req, res, next);
  });

  test("getHistory sucesso", async () => {

    const req = { params: { id: 1 } };

    GameService.getHistory.mockResolvedValue({
      ok: true,
      status: 200,
      value: []
    });

    await GameController.getHistory(req, res, next);
  });

  test("seePlayerHand sucesso", async () => {

    const req = { params: { id: 1 }, userId: 5 };

    GameService.seePlayerHand.mockResolvedValue({
      ok: true,
      status: 200,
      value: []
    });

    await GameController.seePlayerHand(req, res, next);
  });

  test("jogarUmaCarta sucesso", async () => {

    const req = {
      params: { id: 1 },
      userId: 5,
      body: { cardId: 10 }
    };

    GameService.jogarUmaCarta.mockResolvedValue({
      ok: true,
      status: 200,
      value: {}
    });

    await GameController.jogarUmaCarta(req, res, next);

    expect(res.json).toHaveBeenCalledWith({
      message: "Jogador jogou a carta com sucesso",
      data: {}
    });
  });

  test("comprarCarta sucesso", async () => {

    const req = { params: { id: 1 }, userId: 5 };

    GameService.comprarSeNaoPuderJogar.mockResolvedValue({
      ok: true,
      status: 200,
      value: {}
    });

    await GameController.comprarCarta(req, res, next);
  });

  test("obterRanking sucesso", async () => {

    const req = { params: { id: 1 } };

    GameService.obterRankingPartida.mockResolvedValue({
      ok: true,
      status: 200,
      value: []
    });

    await GameController.obterRanking(req, res, next);
  });

  test("comprarSeNaoPuderJogar sucesso", async () => {

    const req = { params: { id: 1 }, userId: 5 };

    GameService.comprarSeNaoPuderJogar.mockResolvedValue({
      ok: true,
      status: 200,
      value: {}
    });

    await GameController.comprarSeNaoPuderJogar(req, res, next);
  });

  test("abandonarJogo sucesso", async () => {

    const req = { params: { id: 1 }, userId: 5 };

    GameService.abandonarJogo.mockResolvedValue({
      ok: true,
      status: 200,
      value: {}
    });

    await GameController.abandonarjogo(req, res, next);
  });

  test("getEstadoAtual", async () => {

    const req = { params: { id: 1 } };

    GameService.jogadorDaVez.mockResolvedValue({ player: 1 });
    GameService.topoDescarte.mockResolvedValue({ card: "R5" });

    await GameController.getEstadoAtual(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });

  test("dizerUno sucesso", async () => {

    const req = {
      params: { gameId: 1 },
      userId: 5
    };

    GameService.dizerUno.mockResolvedValue({
      ok: true,
      status: 200,
      value: {}
    });

    await GameController.dizerUno(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
  });

});