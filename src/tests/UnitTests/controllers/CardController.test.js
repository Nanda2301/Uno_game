const CardController = require("../../../../src/controllers/CardController");
const cardService = require("../../../../src/services/CardService");

jest.mock("../../../../src/services/CardService");

describe("CardController", () => {

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

  // =========================
  // CREATE
  // =========================

  it("create → deve retornar carta criada", async () => {

    req.body = { name: "Carta 1" };

    cardService.create.mockResolvedValue({
      ok: true,
      status: 200,
      value: { id: 1, name: "Carta 1" }
    });

    await CardController.create(req, res, next);

    expect(cardService.create).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ id: 1, name: "Carta 1" });
  });

  it("create → deve chamar next em caso de erro", async () => {

    const error = { ok: false, status: 400 };

    cardService.create.mockResolvedValue(error);

    await CardController.create(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  // =========================
  // FIND ALL
  // =========================

  it("findAll → deve retornar lista de cartas", async () => {

    const cards = [{ id: 1 }, { id: 2 }];

    cardService.findAll.mockResolvedValue({
      ok: true,
      status: 200,
      value: cards
    });

    await CardController.findAll(req, res, next);

    expect(cardService.findAll).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(cards);
  });

  it("findAll → deve chamar next em caso de erro", async () => {

    const error = { ok: false, status: 500 };

    cardService.findAll.mockResolvedValue(error);

    await CardController.findAll(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  // =========================
  // GET BY ID
  // =========================

  it("getById → deve retornar carta", async () => {

    req.params.id = 1;

    const card = { id: 1 };

    cardService.findById.mockResolvedValue({
      ok: true,
      status: 200,
      value: card
    });

    await CardController.getById(req, res, next);

    expect(cardService.findById).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(card);
  });

  it("getById → deve chamar next se falhar", async () => {

    req.params.id = 1;

    const error = { ok: false, status: 404 };

    cardService.findById.mockResolvedValue(error);

    await CardController.getById(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  // =========================
  // UPDATE
  // =========================

  it("update → deve atualizar carta", async () => {

    req.params.id = 1;
    req.body = { name: "Nova carta" };

    const updated = { id: 1, name: "Nova carta" };

    cardService.update.mockResolvedValue({
      ok: true,
      status: 200,
      value: updated
    });

    await CardController.update(req, res, next);

    expect(cardService.update).toHaveBeenCalledWith(1, req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(updated);
  });

  it("update → deve chamar next se falhar", async () => {

    const error = { ok: false, status: 400 };

    cardService.update.mockResolvedValue(error);

    await CardController.update(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  // =========================
  // DELETE
  // =========================

  it("delete → deve remover carta", async () => {

    req.params.id = 1;

    const result = { message: "Carta removida" };

    cardService.delete.mockResolvedValue({
      ok: true,
      status: 200,
      value: result
    });

    await CardController.delete(req, res, next);

    expect(cardService.delete).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(result);
  });

  it("delete → deve chamar next se falhar", async () => {

    const error = { ok: false, status: 500 };

    cardService.delete.mockResolvedValue(error);

    await CardController.delete(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

});