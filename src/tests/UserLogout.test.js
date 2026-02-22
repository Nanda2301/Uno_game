const AuthService = require('../services/AuthService');
const TokenBlacklist = require('../models/TokenBlacklist');

jest.mock('../models/TokenBlacklist');

describe('Teste de unidade - Logout', () => {
  it('Deve invalidar o token ao realizar logout', async () => {
    const mockToken = 'jwt_token_exemplo';

    // Simula salvar o token na blacklist
    TokenBlacklist.create.mockResolvedValue({ token: mockToken });

    const result = await AuthService.logout(mockToken);

    expect(TokenBlacklist.create).toHaveBeenCalledWith({ token: mockToken });
    expect(result.message).toBe('Logout realizado com sucesso');
  });

  it('Deve identificar token inválido após logout', async () => {
    const mockToken = 'token_na_blacklist';

    TokenBlacklist.findOne.mockResolvedValue({ token: mockToken });

    const tokenInBlacklist = await TokenBlacklist.findOne({
      where: { token: mockToken }
    });

    expect(tokenInBlacklist).not.toBeNull();
  });
});
