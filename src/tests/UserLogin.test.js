const AuthService = require('../services/AuthService');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

jest.mock('../models/User');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('Teste de unidade - Login', () => {
  it('Deve autenticar o usuário e retornar um token JWT', async () => {
    const mockUser = {
      id: 1,
      email: 'teste@email.com',
      password: 'senha_hash'
    };

    User.findOne.mockResolvedValue(mockUser);

    bcrypt.compare.mockResolvedValue(true);

    jwt.sign.mockReturnValue('jwt_token_gerado');

    const result = await AuthService.login('teste@email.com', '123456');

    expect(User.findOne).toHaveBeenCalledWith({
      where: { email: 'teste@email.com' }
    });

    expect(bcrypt.compare).toHaveBeenCalled();
    expect(result.token).toBe('jwt_token_gerado');
  });
});
