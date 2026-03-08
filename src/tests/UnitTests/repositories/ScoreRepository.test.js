const ScoreRepository = require("../../../../src/repositories/ScoreRepository");
const Score = require("../../../../src/models/Score");

jest.mock("../../../../src/models/Score");

describe("ScoreRepository", () => {

  it("create", async () => {

    Score.create.mockResolvedValue({});

    await ScoreRepository.create({});

    expect(Score.create).toHaveBeenCalled();

  });

  it("findAll", async () => {

    Score.findAll.mockResolvedValue([]);

    const result = await ScoreRepository.findAll();

    expect(result).toEqual([]);

  });

});