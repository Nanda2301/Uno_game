const AuthController = require("../../../../src/controllers/AuthController");
const AuthService = require("../../../../src/services/AuthService");

jest.mock("../../../../src/services/AuthService");

describe("AuthController", () => {

  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  it("login sucesso", async () => {

    const req = { body: { email: "a", password: "b" } };
    const res = mockResponse();
    const next = jest.fn();

    AuthService.login.mockResolvedValue({
      ok: true,
      status: 200,
      value: "TOKEN"
    });

    await AuthController.login(req, res, next);

    expect(AuthService.login).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ token: "TOKEN" });

  });

  it("login erro", async () => {

    const req = { body: { email: "a", password: "b" } };
    const res = mockResponse();
    const next = jest.fn();

    AuthService.login.mockResolvedValue({
      ok: false
    });

    await AuthController.login(req, res, next);

    expect(next).toHaveBeenCalled();

  });

  it("logout sucesso", async () => {

    const req = {
      headers: { authorization: "Bearer TOKEN" }
    };

    const res = mockResponse();
    const next = jest.fn();

    AuthService.logout.mockResolvedValue({
      ok: true,
      status: 200,
      value: { message: "logout" }
    });

    await AuthController.logout(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);

  });

});