const UserController = require("../../../../src/controllers/UserController");
const userService = require("../../../../src/services/UserService");

jest.mock("../../../../src/services/UserService");

describe("UserController", () => {

  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  let req;
  let res;
  let next;

  beforeEach(() => {
    req = { body: {}, params: {}, userId: 1 };
    res = mockResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  // CREATE

  it("create → sucesso", async () => {

    const value = { id: 1, name: "User" };

    userService.create.mockResolvedValue({
      ok: true,
      status: 200,
      value
    });

    await UserController.create(req, res, next);

    expect(userService.create).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(value);
  });

  it("create → erro", async () => {

    const error = { ok: false };

    userService.create.mockResolvedValue(error);

    await UserController.create(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  // GET BY ID

  it("getById → sucesso", async () => {

    req.params.id = 2;

    const value = { id: 2 };

    userService.findById.mockResolvedValue({
      ok: true,
      status: 200,
      value
    });

    await UserController.getById(req, res, next);

    expect(userService.findById).toHaveBeenCalledWith(2);
    expect(res.json).toHaveBeenCalledWith(value);
  });

  it("getById → erro", async () => {

    const error = { ok: false };

    userService.findById.mockResolvedValue(error);

    await UserController.getById(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  // UPDATE

  it("update → sucesso", async () => {

    const value = { id: 1, name: "Updated" };

    userService.update.mockResolvedValue({
      ok: true,
      status: 200,
      value
    });

    await UserController.update(req, res, next);

    expect(userService.update).toHaveBeenCalledWith(1, req.body);
    expect(res.json).toHaveBeenCalledWith(value);
  });

  it("update → erro", async () => {

    const error = { ok: false };

    userService.update.mockResolvedValue(error);

    await UserController.update(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  // FIND ALL

  it("findAll → sucesso", async () => {

    const users = [{ id: 1 }];

    userService.findAll.mockResolvedValue({
      ok: true,
      status: 200,
      value: users
    });

    await UserController.findAll(req, res, next);

    expect(userService.findAll).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(users);
  });

  it("findAll → erro", async () => {

    const error = { ok: false };

    userService.findAll.mockResolvedValue(error);

    await UserController.findAll(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  // DELETE

  it("delete → sucesso", async () => {

    req.params.id = 1;

    const value = { message: "deleted" };

    userService.delete.mockResolvedValue({
      ok: true,
      status: 200,
      value
    });

    await UserController.delete(req, res, next);

    expect(userService.delete).toHaveBeenCalledWith(1);
    expect(res.json).toHaveBeenCalledWith(value);
  });

  it("delete → erro", async () => {

    const error = { ok: false };

    userService.delete.mockResolvedValue(error);

    await UserController.delete(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  // ABOUT ME

  it("aboutMe → sucesso", async () => {

    const value = { id: 1 };

    userService.findById.mockResolvedValue({
      ok: true,
      status: 200,
      value
    });

    await UserController.aboutMe(req, res, next);

    expect(userService.findById).toHaveBeenCalledWith(1);
    expect(res.json).toHaveBeenCalledWith(value);
  });

  it("aboutMe → erro", async () => {

    const error = { ok: false };

    userService.findById.mockResolvedValue(error);

    await UserController.aboutMe(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

});