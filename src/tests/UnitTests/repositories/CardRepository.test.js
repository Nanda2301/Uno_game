const CardRepository = require("../../../../src/repositories/CardRepository");
const Card = require("../../../../src/models/Card");

jest.mock("../../../../src/models/Card");

describe("CardRepository", () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("create", async () => {

    Card.create.mockResolvedValue({ id: 1 });

    const result = await CardRepository.create({});

    expect(Card.create).toHaveBeenCalled();

  });

  it("findAll", async () => {

    Card.findAll.mockResolvedValue([]);

    const result = await CardRepository.findAll();

    expect(Card.findAll).toHaveBeenCalled();

  });

  it("findById", async () => {

    Card.findByPk.mockResolvedValue({ id: 1 });

    const result = await CardRepository.findById(1);

    expect(result.id).toBe(1);

  });

  it("update sucesso", async () => {

    const save = jest.fn();

    Card.findByPk.mockResolvedValue({
      color: "red",
      save,
      get: () => ({ color: "blue" })
    });

    const result = await CardRepository.update(1, { color: "blue" });

    expect(save).toHaveBeenCalled();

  });

  it("update carta inexistente", async () => {

    Card.findByPk.mockResolvedValue(null);

    const result = await CardRepository.update(1, {});

    expect(result).toBeNull();

  });

  it("delete por id", async () => {

    const destroy = jest.fn();

    Card.findByPk.mockResolvedValue({ destroy });

    const result = await CardRepository.delete(1);

    expect(result).toBe(true);

  });

});