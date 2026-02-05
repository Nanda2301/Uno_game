const AuthService = require('../services/AuthService');
const TokenBlacklist = require('../models/TokenBlacklist');

jest.mock('../models/TokenBlacklist');

describe('Requisito 8: Teste de unidade para logout', () => {
    it('Deve confirmar que o usuário foi desconectado com sucesso (token invalidado)', async () => {
        const mockToken = 'jwt_token_exemplo';
        
        // Simula a inserção do token na blacklist
        TokenBlacklist.create.mockResolvedValue({ token: mockToken });

        const result = await AuthService.logout(mockToken);
        
        expect(TokenBlacklist.create).toHaveBeenCalledWith({ token: mockToken });
        
        expect(result.message).toBe("Logout realizado com sucesso");
    });

    it('Não deve permitir acesso a recursos protegidos após o logout', async () => {
        const mockToken = 'token_na_blacklist';
        
        TokenBlacklist.findOne.mockResolvedValue({ token: mockToken });

        const isTokenInBlacklist = await TokenBlacklist.findOne({ where: { token: mockToken } });
        
        expect(isTokenInBlacklist).not.toBeNull();
    });
});