const UserService = require("../../../services/UserService");
const UserRepository = require("../../../repositories/UserRepository");

jest.mock("../../../repositories/UserRepository");

describe("UserService", () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {

    test("deve criar usuário com sucesso", async () => {

      const data = {
        name: "João",
        userName: "joao123",
        email: "joao@email.com",
        password: "123"
      };

      UserRepository.emailExist.mockResolvedValue(false);

      UserRepository.create.mockResolvedValue({
        id: 1,
        ...data
      });

      const result = await UserService.create(data);

      expect(result.ok).toBe(true);
      expect(result.status).toBe(201);
      expect(result.value.email).toBe(data.email);
    });

    test("deve falhar se senha não for informada", async () => {

      const result = await UserService.create({
        name: "João",
        userName: "joao123",
        email: "teste@email.com"
      });

      expect(result.ok).toBe(false);
      expect(result.status).toBe(400);
    });

    test("deve falhar se username não for informado", async () => {

      const result = await UserService.create({
        name: "João",
        email: "teste@email.com",
        password: "123"
      });

      expect(result.ok).toBe(false);
      expect(result.status).toBe(400);
    });

    test("deve falhar se email já existir", async () => {

      const data = {
        name: "João",
        userName: "joao123",
        email: "joao@email.com",
        password: "123"
      };

      UserRepository.emailExist.mockResolvedValue(true);

      const result = await UserService.create(data);

      expect(result.ok).toBe(false);
      expect(result.status).toBe(406);
    });

  });

  describe("findById", () => {

    test("deve retornar usuário quando existir", async () => {

      const user = { id: 1, name: "João" };

      UserRepository.findById.mockResolvedValue(user);

      const result = await UserService.findById(1);

      expect(result.ok).toBe(true);
      expect(result.value.id).toBe(1);
    });

    test("deve falhar quando usuário não existir", async () => {

      UserRepository.findById.mockResolvedValue(null);

      const result = await UserService.findById(1);

      expect(result.ok).toBe(false);
      expect(result.status).toBe(404);
    });

  });

  describe("update", () => {

    test("deve atualizar usuário", async () => {

      const updatedUser = {
        id: 1,
        name: "Novo Nome"
      };

      UserRepository.update.mockResolvedValue(updatedUser);

      const result = await UserService.update(1, { name: "Novo Nome" });

      expect(result.ok).toBe(true);
      expect(result.value.name).toBe("Novo Nome");
    });

    test("deve falhar se usuário não existir", async () => {

      UserRepository.update.mockResolvedValue(null);

      const result = await UserService.update(1, { name: "Teste" });

      expect(result.ok).toBe(false);
      expect(result.status).toBe(404);
    });

  });

  describe("findAll", () => {

    test("deve retornar todos usuários", async () => {

      const users = [
        { id: 1, name: "João" },
        { id: 2, name: "Maria" }
      ];

      UserRepository.findAll.mockResolvedValue(users);

      const result = await UserService.findAll();

      expect(result.ok).toBe(true);
      expect(result.value.length).toBe(2);
    });

  });

  describe("delete", () => {

    test("deve deletar usuário", async () => {

      UserRepository.delete.mockResolvedValue(true);

      const result = await UserService.delete(1);

      expect(result.ok).toBe(true);
      expect(result.value).toBe("User account was deleted successfully");
    });

    test("deve falhar se usuário não existir", async () => {

      UserRepository.delete.mockResolvedValue(null);

      const result = await UserService.delete(1);

      expect(result.ok).toBe(false);
      expect(result.status).toBe(404);
    });

  });

  describe("findUserByEmail", () => {

    test("deve retornar usuário pelo email", async () => {

      const user = {
        id: 1,
        email: "teste@email.com"
      };

      UserRepository.findByEmail.mockResolvedValue(user);

      const result = await UserService.findUserByEmail("teste@email.com");

      expect(result.ok).toBe(true);
      expect(result.value.email).toBe("teste@email.com");
    });

    test("deve falhar se usuário não existir", async () => {

      UserRepository.findByEmail.mockResolvedValue(null);

      const result = await UserService.findUserByEmail("teste@email.com");

      expect(result.ok).toBe(false);
      expect(result.status).toBe(404);
    });

  });

});