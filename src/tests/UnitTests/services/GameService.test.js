const GameService = require("../../../services/GameService");

const GameRepository = require("../../../repositories/GameRepository");
const GamePlayerRepository = require("../../../repositories/GamePlayerRepository");
const UserRepository = require("../../../repositories/UserRepository");
const CardService = require("../../../services/CardService");
const ScoreService = require("../../../services/ScoreService");

jest.mock("../../../repositories/GameRepository");
jest.mock("../../../repositories/GamePlayerRepository");
jest.mock("../../../repositories/UserRepository");
jest.mock("../../../services/CardService");
jest.mock("../../../services/ScoreService");

const ok = (value, status = 200) => ({
  ok: true,
  value,
  status
});

const fail = (error, status = 400) => ({
  ok: false,
  error,
  status
});

describe("GameService", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --------------------------------
  // CREATE GAME
  // --------------------------------

  it("deve criar jogo com sucesso", async () => {

    UserRepository.findById.mockResolvedValue({ id: 1 });

    GameRepository.create.mockResolvedValue({ id: 10 });

    GamePlayerRepository.create.mockResolvedValue({});

    ScoreService.create.mockResolvedValue(ok({}));

    CardService.createDeck.mockResolvedValue();

    const result = await GameService.create({}, 1);

    expect(result.ok).toBe(true);
    expect(GameRepository.create).toHaveBeenCalled();
    expect(CardService.createDeck).toHaveBeenCalled();
  });

  it("deve falhar se jogador não existir", async () => {

    UserRepository.findById.mockResolvedValue(null);

    const result = await GameService.create({}, 1);

    expect(result.ok).toBe(false);
  });

  // --------------------------------
  // FIND ALL
  // --------------------------------

  it("deve retornar lista de jogos", async () => {

    GameRepository.findAll.mockResolvedValue([{ id: 1 }]);

    const result = await GameService.findAll();

    expect(result.ok).toBe(true);
  });

  // --------------------------------
  // FIND BY ID
  // --------------------------------

  it("deve retornar jogo", async () => {

    GameRepository.findById.mockResolvedValue({ id: 1 });

    const result = await GameService.findById(1);

    expect(result.ok).toBe(true);
  });

  it("deve retornar erro se jogo não existir", async () => {

    GameRepository.findById.mockResolvedValue(null);

    const result = await GameService.findById(1);

    expect(result.ok).toBe(false);
  });

  // --------------------------------
  // ADD PLAYER
  // --------------------------------

  it("deve adicionar jogador", async () => {

    GameRepository.findById.mockResolvedValue({
      id: 1,
      status: "waiting",
      maxPlayers: 4
    });

    GamePlayerRepository.findByGameId.mockResolvedValue([]);

    GamePlayerRepository.create.mockResolvedValue({});

    ScoreService.create.mockResolvedValue(ok({}));

    const result = await GameService.adicionarJogador(1, 2);

    expect(result.ok).toBe(true);
  });

  // --------------------------------
  // MARCAR PRONTO
  // --------------------------------

  it("deve marcar jogador como pronto", async () => {

    GamePlayerRepository.findOne.mockResolvedValue({});

    GamePlayerRepository.update.mockResolvedValue({});

    const result = await GameService.marcarPronto(1, 2);

    expect(result.ok).toBe(true);
  });

  it("deve falhar se jogador não estiver no jogo", async () => {

    GamePlayerRepository.findOne.mockResolvedValue(null);

    const result = await GameService.marcarPronto(1, 2);

    expect(result.ok).toBe(false);
  });

  // --------------------------------
  // INICIAR JOGO
  // --------------------------------

  it("deve iniciar jogo", async () => {

    GameRepository.findById.mockResolvedValue({
      id: 1,
      status: "waiting",
      creatorId: 1
    });

    GamePlayerRepository.findByGameId.mockResolvedValue([
      { ready: true },
      { ready: true }
    ]);

    CardService.drawCard.mockResolvedValue({
      id: 1,
      color: "red",
      value: "5"
    });

    GameRepository.update.mockResolvedValue({});

    const result = await GameService.iniciarJogo(1, 1);

    expect(result.ok).toBe(true);
  });

  // --------------------------------
  // FINALIZAR JOGO
  // --------------------------------

  it("deve finalizar jogo", async () => {

    GameRepository.findById.mockResolvedValue({
      creatorId: 1,
      status: "in_progress"
    });

    GameRepository.update.mockResolvedValue({});

    const result = await GameService.finalizarJogo(1, 1);

    expect(result.ok).toBe(true);
  });

  // --------------------------------
  // DELETE GAME
  // --------------------------------

  it("deve deletar jogo", async () => {

    GameRepository.findById.mockResolvedValue({});

    GameRepository.delete.mockResolvedValue();

    const result = await GameService.delete(1);

    expect(result.ok).toBe(true);
  });

  // --------------------------------
  // UNO
  // --------------------------------

  it("deve registrar UNO", async () => {

    CardService.seePlayerCards.mockResolvedValue(ok([{}]));

    const result = await GameService.dizerUno(1, 2);

    expect(result.ok).toBe(true);
  });

});