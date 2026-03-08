const CardService = require('../../../services/CardService');
const CardRepository = require('../../../repositories/CardRepository');
const Result = require('../../../config/result');

jest.mock('../../../repositories/CardRepository');

describe("CardService", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // -------------------------
  // CREATE DECK
  // -------------------------
  it("deve criar um deck completo", async () => {

    CardRepository.createMany.mockResolvedValue(true);

    const result = await CardService.createDeck(1);

    expect(CardRepository.createMany).toHaveBeenCalled();
  });

  // -------------------------
  // CREATE
  // -------------------------
  it("deve falhar se cor não informada", async () => {

    const result = await CardService.create({});

    expect(result.ok).toBe(false);
  });

  it("deve falhar se value não informado", async () => {

    const result = await CardService.create({ color: "red" });

    expect(result.ok).toBe(false);
  });

  it("deve falhar se gameId não informado", async () => {

    const result = await CardService.create({ color: "red", value: "5" });

    expect(result.ok).toBe(false);
  });

  it("deve criar carta", async () => {

    CardRepository.create.mockResolvedValue({ id: 1 });

    const result = await CardService.create({
      color: "red",
      value: "5",
      gameId: 1
    });

    expect(result.ok).toBe(true);
    expect(CardRepository.create).toHaveBeenCalled();
  });

  // -------------------------
  // FIND ALL
  // -------------------------
  it("deve retornar todas as cartas", async () => {

    CardRepository.findAll.mockResolvedValue([{ id: 1 }]);

    const result = await CardService.findAll();

    expect(result.ok).toBe(true);
  });

  // -------------------------
  // FIND BY ID
  // -------------------------
  it("deve falhar sem id", async () => {

    const result = await CardService.findById();

    expect(result.ok).toBe(false);
  });

  it("deve falhar se carta não encontrada", async () => {

    CardRepository.findById.mockResolvedValue(null);

    const result = await CardService.findById(1);

    expect(result.ok).toBe(false);
  });

  it("deve retornar carta com label", async () => {

    CardRepository.findById.mockResolvedValue({
      id: 1,
      color: "red",
      value: "5",
      toJSON() {
        return { id: 1, color: "red", value: "5" };
      }
    });

    const result = await CardService.findById(1);

    expect(result.ok).toBe(true);
    expect(result.value.label).toContain("RED");
  });

  // -------------------------
  // UPDATE
  // -------------------------
  it("deve atualizar carta", async () => {

    CardRepository.update.mockResolvedValue({ id: 1 });

    const result = await CardService.update(1, { color: "blue" });

    expect(result.ok).toBe(true);
  });

  it("deve falhar se carta não encontrada", async () => {

    CardRepository.update.mockResolvedValue(null);

    const result = await CardService.update(1, {});

    expect(result.ok).toBe(false);
  });

  // -------------------------
  // DELETE
  // -------------------------
  it("deve falhar sem id", async () => {

    const result = await CardService.delete();

    expect(result.ok).toBe(false);
  });

  it("deve falhar se carta não encontrada", async () => {

    CardRepository.delete.mockResolvedValue(null);

    const result = await CardService.delete(1);

    expect(result.ok).toBe(false);
  });

  it("deve deletar carta", async () => {

    CardRepository.delete.mockResolvedValue(true);

    const result = await CardService.delete(1);

    expect(result.ok).toBe(true);
  });

  // -------------------------
  // DRAW CARD
  // -------------------------
  it("deve comprar carta do baralho", async () => {

    CardRepository.findOne.mockResolvedValue({ id: 1 });

    CardRepository.update.mockResolvedValue({ id: 1 });

    const result = await CardService.drawCard(1);

    expect(CardRepository.update).toHaveBeenCalled();
  });

  it("deve lançar erro se baralho vazio", async () => {

    CardRepository.findOne.mockResolvedValue(null);

    await expect(CardService.drawCard(1))
      .rejects
      .toThrow();
  });

  // -------------------------
  // VALIDAR JOGADA
  // -------------------------
  it("deve permitir jogar carta da mesma cor", () => {

    const validar = CardService.validarJogada({
      color: "red",
      value: "5"
    });

    const result = validar({
      color: "red",
      value: "9"
    });

    expect(result).toBe(true);
  });

  it("deve permitir carta preta", () => {

    const validar = CardService.validarJogada({
      color: "red",
      value: "5"
    });

    const result = validar({
      color: "black",
      value: "wild"
    });

    expect(result).toBe(true);
  });

  // -------------------------
  // DRAW TO PLAYER
  // -------------------------
  it("deve comprar carta para jogador", async () => {

    CardRepository.findOne.mockResolvedValue({ id: 1 });

    CardRepository.update.mockResolvedValue({ id: 1 });

    const result = await CardService.drawToPlayer(1, 2);

    expect(CardRepository.update).toHaveBeenCalled();
  });

  it("deve lançar erro se não houver cartas", async () => {

    CardRepository.findOne.mockResolvedValue(null);

    await expect(CardService.drawToPlayer(1, 2))
      .rejects
      .toThrow();
  });

  // -------------------------
  // SEE PLAYER CARDS
  // -------------------------
  it("deve retornar cartas do jogador", async () => {

    CardRepository.findAll.mockResolvedValue([{ id: 1 }]);

    const result = await CardService.seePlayerCards(1, 2);

    expect(result.ok).toBe(true);
  });

  // -------------------------
  // JOGAR UMA CARTA
  // -------------------------
  it("deve jogar carta", async () => {

    CardRepository.findOne.mockResolvedValue({ id: 1 });

    CardRepository.update.mockResolvedValue({ id: 1 });

    const result = await CardService.jogarUmaCarta(
      { id: 1 },
      2,
      1
    );

    expect(result.ok).toBe(true);
  });

  it("deve falhar se carta não estiver na mão", async () => {

    CardRepository.findOne.mockResolvedValue(null);

    const result = await CardService.jogarUmaCarta(
      { id: 1 },
      2,
      1
    );

    expect(result.ok).toBe(false);
  });

});