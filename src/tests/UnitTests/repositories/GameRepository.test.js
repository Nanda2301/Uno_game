const GameRepository = require("../../../../src/repositories/GameRepository");
const Game = require("../../../../src/models/Game");
const GamePlayer = require("../../../models/GamePlayer");

jest.mock("../../../../src/models/Game");
jest.mock("../../../models/GamePlayer");

describe("GameRepository", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // -----------------------
  // CREATE
  // -----------------------
  it("deve criar um game", async () => {

    const fakeGame = { id: 1 };

    Game.create.mockResolvedValue(fakeGame);

    const data = { title: "UNO" };

    const result = await GameRepository.create(data);

    expect(Game.create).toHaveBeenCalledWith(data);
    expect(result).toEqual(fakeGame);
  });

  // -----------------------
  // FIND ALL
  // -----------------------
  it("deve retornar todos os jogos", async () => {

    const fakeGames = [{ id: 1 }];

    Game.findAll.mockResolvedValue(fakeGames);

    const result = await GameRepository.findAll();

    expect(Game.findAll).toHaveBeenCalledWith({ raw: true });
    expect(result).toEqual(fakeGames);
  });

  // -----------------------
  // FIND BY ID (RAW)
  // -----------------------
  it("deve buscar jogo por id com raw true", async () => {

    const fakeGame = { id: 1 };

    Game.findByPk.mockResolvedValue(fakeGame);

    const result = await GameRepository.findById(1, true);

    expect(Game.findByPk).toHaveBeenCalledWith(1, { raw: true });
    expect(result).toEqual(fakeGame);
  });

  // -----------------------
  // FIND BY ID COM PLAYERS
  // -----------------------
  it("deve buscar jogo com players", async () => {

    const fakeGame = { id: 1 };

    Game.findByPk.mockResolvedValue(fakeGame);

    const result = await GameRepository.findById(1);

    expect(Game.findByPk).toHaveBeenCalledWith(1, {
      include: [
        {
          model: GamePlayer,
          as: "players",
          attributes: ["id", "playerId", "ready", "position", "score"]
        }
      ]
    });

    expect(result).toEqual(fakeGame);
  });

  // -----------------------
  // UPDATE GAME NÃO EXISTE
  // -----------------------
  it("deve retornar null se game não existir no update", async () => {

    Game.findByPk.mockResolvedValue(null);

    const result = await GameRepository.update(1, { title: "Novo" });

    expect(result).toBeNull();
  });

  // -----------------------
  // UPDATE GAME
  // -----------------------
  it("deve atualizar campos do jogo", async () => {

    const saveMock = jest.fn();
    const getMock = jest.fn().mockReturnValue({ id: 1, title: "Novo" });

    const gameMock = {
      title: "Antigo",
      save: saveMock,
      get: getMock
    };

    Game.findByPk.mockResolvedValue(gameMock);

    const result = await GameRepository.update(1, {
      title: "Novo",
      status: "started",
      maxPlayers: 4,
      topDiscardCardId: 10,
      currentPlayerPosition: 2,
      direction: 1,
      creatorId: 5
    });

    expect(saveMock).toHaveBeenCalled();
    expect(result).toEqual({ id: 1, title: "Novo" });
  });

  // -----------------------
  // DELETE NÃO EXISTE
  // -----------------------
  it("deve retornar null se jogo não existir", async () => {

    Game.findByPk.mockResolvedValue(null);

    const result = await GameRepository.delete(1);

    expect(result).toBeNull();
  });

  // -----------------------
  // DELETE GAME
  // -----------------------
  it("deve deletar jogo", async () => {

    const destroyMock = jest.fn();

    const gameMock = {
      destroy: destroyMock
    };

    Game.findByPk.mockResolvedValue(gameMock);

    const result = await GameRepository.delete(1);

    expect(destroyMock).toHaveBeenCalled();
    expect(result).toBe(true);
  });

  // -----------------------
  // GAME EXISTS TRUE
  // -----------------------
  it("deve retornar true se jogo existir", async () => {

    Game.count.mockResolvedValue(1);

    const result = await GameRepository.gameExists(1);

    expect(Game.count).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(result).toBe(true);
  });

  // -----------------------
  // GAME EXISTS FALSE
  // -----------------------
  it("deve retornar false se jogo não existir", async () => {

    Game.count.mockResolvedValue(0);

    const result = await GameRepository.gameExists(1);

    expect(result).toBe(false);
  });

});