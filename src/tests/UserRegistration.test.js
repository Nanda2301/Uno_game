const UserService = require('../services/UserService');
const UserRepository = require('../repositories/UserRepository');

jest.mock('../repositories/UserRepository');

describe('Requisito 6: Registro de novo usuário', () => {
    
    it('Deve registrar um usuário com informações válidas', async () => {
        const newUser = { 
            name: 'Fernanda', 
            userName: 'fer_uno', 
            email: 'fer@teste.com', 
            password: '123' 
        };
        UserRepository.emailExist.mockResolvedValue(false);
        UserRepository.create.mockResolvedValue({ email: 'fer@teste.com' });

        const result = await UserService.create(newUser);
        expect(result.error).toBe(false);
    });

    it('Deve retornar erro ao tentar registrar com e-mail já existente', async () => {
        const userData = { 
            name: 'Fernanda', 
            userName: 'fer_uno', 
            email: 'fer@teste.com', 
            password: '123' 
        };
        
        UserRepository.emailExist.mockResolvedValue(true);
        
        const result = await UserService.create(userData);
        expect(result.message).toContain("Não pode repetir o email");
    });

    it('Deve tratar erro de dados ausentes (ex: sem password)', async () => {
        const result = await UserService.create({ 
            name: 'User', 
            userName: 'user123', 
            email: 'user@email.com' 
        });
        
        expect(result.message).toBe("Tem que enviar o password");
    });
    
    it('Deve tratar erro de nome de usuário ausente', async () => {
        const result = await UserService.create({ 
            name: 'User', 
            email: 'user@email.com',
            password: '123'
        });
        
        expect(result.message).toBe("Tem que enviar o nome de usuário");
    });
});