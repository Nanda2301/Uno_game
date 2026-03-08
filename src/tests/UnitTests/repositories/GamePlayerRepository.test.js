const GamePlayerRepository = require("../../../../src/repositories/GamePlayerRepository");
const GamePlayer = require("../../../../src/models/GamePlayer");

jest.mock("../../../../src/models/GamePlayer");

describe("GamePlayerRepository", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // -----------------------
  // CREATE
  // -----------------------
  it("deve criar um GamePlayer", async () => {

    const fake = { id: 1 };
    GamePlayer.create.mockResolvedValue(fake);

    const data = { gameId: 1, playerId: 2 };

    const result = await GamePlayerRepository.create(data);

    expect(GamePlayer.create).toHaveBeenCalledWith(data);
    expect(result).toEqual(fake);
  });

  // -----------------------
  // FIND BY GAME ID
  // -----------------------
  it("deve buscar jogadores por gameId", async () => {

    const fake = [{ id: 1 }];
    GamePlayer.findAll.mockResolvedValue(fake);

    const result = await GamePlayerRepository.findByGameId(1);

    expect(GamePlayer.findAll).toHaveBeenCalledWith({
      where: { gameId: 1 },
      order: [["position", "ASC"]]
    });

    expect(result).toEqual(fake);
  });

  // -----------------------
  // FIND ONE
  // -----------------------
  it("deve buscar um jogador específico", async () => {

    const fake = { id: 1 };
    GamePlayer.findOne.mockResolvedValue(fake);

    const result = await GamePlayerRepository.findOne(1, 2);

    expect(GamePlayer.findOne).toHaveBeenCalledWith({
      where: {
        gameId: 1,
        playerId: 2
      }
    });

    expect(result).toEqual(fake);
  });

  // -----------------------
  // FIND BY POSITION
  // -----------------------
  it("deve buscar jogador pela posição", async () => {

    const fake = { id: 1 };
    GamePlayer.findOne.mockResolvedValue(fake);

    const result = await GamePlayerRepository.findByPosition(1, 3);

    expect(GamePlayer.findOne).toHaveBeenCalledWith({
      where: { gameId: 1, position: 3 }
    });

    expect(result).toEqual(fake);
  });

  // -----------------------
  // UPDATE
  // -----------------------
  it("deve atualizar um GamePlayer", async () => {

    const updated = { id: 1, score: 10 };

    const gamePlayerMock = {
      update: jest.fn().mockResolvedValue(updated)
    };

    const result = await GamePlayerRepository.update(gamePlayerMock, { score: 10 });

    expect(gamePlayerMock.update).toHaveBeenCalledWith({ score: 10 });
    expect(result).toEqual(updated);
  });

  // -----------------------
  // DELETE
  // -----------------------
  it("deve deletar um GamePlayer", async () => {

    const gamePlayerMock = {
      destroy: jest.fn().mockResolvedValue(true)
    };

    const result = await GamePlayerRepository.delete(gamePlayerMock);

    expect(gamePlayerMock.destroy).toHaveBeenCalled();
    expect(result).toBe(true);
  });

  // -----------------------
  // DELETE ALL BY GAME ID
  // -----------------------
  it("deve deletar todos os jogadores de um jogo", async () => {

    GamePlayer.destroy.mockResolvedValue(3);

    const result = await GamePlayerRepository.deleteAllByGameId(1);

    expect(GamePlayer.destroy).toHaveBeenCalledWith({
      where: { gameId: 1 }
    });

    expect(result).toBe(3);
  });

  // -----------------------
  // FIND SCORES
  // -----------------------
  it("deve retornar placar ordenado", async () => {

    const fake = [
      { playerId: 1, score: 50, position: 1 }
    ];

    GamePlayer.findAll.mockResolvedValue(fake);

    const result = await GamePlayerRepository.findScoresByGameId(1);

    expect(GamePlayer.findAll).toHaveBeenCalledWith({
      where: { gameId: 1 },
      attributes: ["playerId", "score", "position"],
      order: [["score", "DESC"]],
      raw: true
    });

    expect(result).toEqual(fake);
  });

});