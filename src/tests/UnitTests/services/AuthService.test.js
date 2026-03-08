const AuthService = require("../../../services/AuthService");
const { findUserByEmail } = require("../../../services/UserService");
const TokenBlacklist = require("../../../models/TokenBlacklist");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

jest.mock("../../../services/UserService");
jest.mock("../../../models/TokenBlacklist");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("AuthService", () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("login", () => {

    test("deve retornar token quando login for válido", async () => {

      const user = {
        id: 1,
        email: "teste@email.com",
        password: "hash"
      };

      findUserByEmail.mockResolvedValue({
        ok: true,
        value: user
      });

      bcrypt.compare.mockResolvedValue(true);

      jwt.sign.mockReturnValue("token_fake");

      const result = await AuthService.login("teste@email.com", "123");

      expect(result.ok).toBe(true);
      expect(result.value).toBe("token_fake");

      expect(jwt.sign).toHaveBeenCalled();
    });

    test("deve falhar se email ou senha não forem informados", async () => {

      const result = await AuthService.login(null, null);

      expect(result.ok).toBe(false);
      expect(result.status).toBe(400);
    });

    test("deve retornar erro se usuário não existir", async () => {

      findUserByEmail.mockResolvedValue({
        ok: false,
        status: 404
      });

      const result = await AuthService.login("teste@email.com", "123");

      expect(result.ok).toBe(false);
      expect(result.status).toBe(404);
    });

    test("deve falhar se senha estiver incorreta", async () => {

      const user = {
        id: 1,
        email: "teste@email.com",
        password: "hash"
      };

      findUserByEmail.mockResolvedValue({
        ok: true,
        value: user
      });

      bcrypt.compare.mockResolvedValue(false);

      const result = await AuthService.login("teste@email.com", "123");

      expect(result.ok).toBe(false);
      expect(result.status).toBe(401);
    });

    test("deve retornar erro interno se ocorrer exceção", async () => {

      findUserByEmail.mockRejectedValue(new Error("Erro inesperado"));

      const result = await AuthService.login("teste@email.com", "123");

      expect(result.ok).toBe(false);
      expect(result.status).toBe(500);
    });

  });

  describe("logout", () => {

    test("deve realizar logout com sucesso", async () => {

      TokenBlacklist.create.mockResolvedValue(true);

      const result = await AuthService.logout("token_fake");

      expect(result.ok).toBe(true);
      expect(result.value.message).toBe("Logout realizado com sucesso");

      expect(TokenBlacklist.create).toHaveBeenCalledWith({
        token: "token_fake"
      });
    });

    test("deve falhar se token não for informado", async () => {

      const result = await AuthService.logout(null);

      expect(result.ok).toBe(false);
      expect(result.status).toBe(400);
    });

    test("deve retornar erro interno se ocorrer exceção", async () => {

      TokenBlacklist.create.mockRejectedValue(new Error("Erro banco"));

      const result = await AuthService.logout("token_fake");

      expect(result.ok).toBe(false);
      expect(result.status).toBe(500);
    });

  });

});