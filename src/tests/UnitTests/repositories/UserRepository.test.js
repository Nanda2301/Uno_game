const UserRepository = require("../../../../src/repositories/UserRepository");
const User = require("../../../../src/models/User");

jest.mock("../../../../src/models/User");

describe("UserRepository", () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("deve criar usuário", async () => {

      User.create.mockResolvedValue({
        name: "John",
        userName: "john123",
        email: "john@email.com"
      });

      const result = await UserRepository.create({
        name: "John",
        userName: "john123",
        email: "john@email.com",
        password: "123"
      });

      expect(User.create).toHaveBeenCalled();
      expect(result).toEqual({
        name: "John",
        userName: "john123",
        email: "john@email.com"
      });
    });
  });

  describe("findById", () => {

    it("deve retornar usuário", async () => {

      User.findByPk.mockResolvedValue({ id: 1 });

      const result = await UserRepository.findById(1);

      expect(result).toEqual({ id: 1 });
    });

  });

  describe("findByEmail", () => {

    it("deve buscar usuário por email", async () => {

      User.findOne.mockResolvedValue({ email: "test@email.com" });

      const result = await UserRepository.findByEmail("test@email.com");

      expect(User.findOne).toHaveBeenCalled();
      expect(result.email).toBe("test@email.com");

    });

  });

  describe("findAll", () => {

    it("deve retornar lista de usuários formatada", async () => {

      User.findAll.mockResolvedValue([
        {
          name: "John",
          userName: "john",
          email: "john@email",
          createdAt: "now",
          updatedAt: "now"
        }
      ]);

      const result = await UserRepository.findAll();

      expect(result.length).toBe(1);
      expect(result[0].name).toBe("John");

    });

  });

  describe("update", () => {

    it("deve atualizar usuário", async () => {

      const updateMock = jest.fn();

      User.findByPk.mockResolvedValue({
        name: "John",
        email: "email",
        update: updateMock
      });

      const result = await UserRepository.update(1, { name: "New" });

      expect(updateMock).toHaveBeenCalled();

    });

    it("deve retornar null se usuário não existir", async () => {

      User.findByPk.mockResolvedValue(null);

      const result = await UserRepository.update(1, {});

      expect(result).toBeNull();

    });

  });

  describe("delete", () => {

    it("deve deletar usuário", async () => {

      const destroy = jest.fn();

      User.findByPk.mockResolvedValue({
        destroy
      });

      const result = await UserRepository.delete(1);

      expect(destroy).toHaveBeenCalled();
      expect(result).toBe(true);

    });

    it("deve retornar null se usuário não existir", async () => {

      User.findByPk.mockResolvedValue(null);

      const result = await UserRepository.delete(1);

      expect(result).toBeNull();

    });

  });

  describe("emailExist", () => {

    it("deve retornar true se email existir", async () => {

      jest.spyOn(UserRepository, "findByEmail").mockResolvedValue({});

      const result = await UserRepository.emailExist("email");

      expect(result).toBe(true);

    });

    it("deve retornar false se email não existir", async () => {

      jest.spyOn(UserRepository, "findByEmail").mockResolvedValue(null);

      const result = await UserRepository.emailExist("email");

      expect(result).toBe(false);

    });

  });

});