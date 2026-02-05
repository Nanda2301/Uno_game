const UserService = require('../services/UserService');
const UserRepository = require('../repositories/UserRepository');

jest.mock('../repositories/UserRepository');

describe('Requisito 9: Teste de unidade para obter perfil de usuário', () => {
    it('Deve recuperar informações válidas do perfil do usuário', async () => {
        const mockUser = { 
            id: 1, 
            name: 'Fernanda', 
            userName: 'fer_uno', 
            email: 'fer@teste.com' 
        };

        // Simula o retorno do repositório
        UserRepository.findById.mockResolvedValue(mockUser);

        // Chama a função correta que foi adicionada ao serviço
        const profile = await UserService.findById(1);
        
        expect(profile).toEqual(mockUser);
        expect(profile.userName).toBe('fer_uno');
    });

    it('Deve tratar erro quando as informações do perfil não estão disponíveis', async () => {
        UserRepository.findById.mockResolvedValue(null);

        const result = await UserService.findById(999);
        
        expect(result).toBeNull();
    });
});