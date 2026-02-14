const UserController = require('../controllers/UserController');
const userService = require('../services/UserService');

jest.mock('../services/UserService');

describe('UserController', () => {

  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      userId: 1
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    };

    next = jest.fn();

    jest.clearAllMocks();
  });

  // ---------------------------
  // CREATE
  // ---------------------------

  it('deve criar usuário com sucesso', async () => {
    userService.create.mockResolvedValue({ id: 1, error: false });

    req.body = { name: 'User' };

    await UserController.create(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
  });

  it('deve retornar 400 se houver erro no create', async () => {
    userService.create.mockResolvedValue({ error: true });

    await UserController.create(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  // ---------------------------
  // GET BY ID
  // ---------------------------

  it('deve retornar usuário por id', async () => {
    userService.findById.mockResolvedValue({ id: 1 });

    req.params.id = 1;

    await UserController.getById(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('deve retornar 404 se usuário não existir', async () => {
    userService.findById.mockResolvedValue(null);

    await UserController.getById(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  // ---------------------------
  // UPDATE
  // ---------------------------

  it('deve atualizar usuário', async () => {
    userService.update.mockResolvedValue({ id: 1 });

    await UserController.update(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('deve retornar 404 se usuário não existir no update', async () => {
    userService.update.mockResolvedValue(null);

    await UserController.update(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  // ---------------------------
  // FIND ALL
  // ---------------------------

  it('deve retornar lista de usuários', async () => {
    userService.findAll.mockResolvedValue([{ id: 1 }]);

    await UserController.findAll(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  // ---------------------------
  // DELETE
  // ---------------------------

  it('deve deletar usuário com sucesso', async () => {
    userService.delete.mockResolvedValue(true);

    await UserController.delete(req, res, next);

    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });

  it('deve retornar 404 se usuário não existir no delete', async () => {
    userService.delete.mockResolvedValue(null);

    await UserController.delete(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  // ---------------------------
  // LOGIN
  // ---------------------------

  it('deve fazer login com sucesso', async () => {
    userService.login.mockResolvedValue({
      status: 200,
      token: 'fake_token'
    });

    req.body = { email: 'email@test.com', password: '123' };

    await UserController.login(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('deve retornar erro no login', async () => {
    userService.login.mockResolvedValue({
      status: 401,
      message: 'User not found'
    });

    await UserController.login(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  // ---------------------------
  // ABOUT ME
  // ---------------------------

  it('deve retornar usuário autenticado', async () => {
    userService.findById.mockResolvedValue({ id: 1 });

    await UserController.aboutMe(req, res, next);

    expect(res.json).toHaveBeenCalled();
  });

  it('deve retornar 404 se usuário não encontrado no aboutMe', async () => {
    userService.findById.mockResolvedValue(null);

    await UserController.aboutMe(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
  });

});
