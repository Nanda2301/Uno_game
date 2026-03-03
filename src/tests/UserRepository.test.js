const UserRepository = require('../repositories/UserRepository');
const sequelize = require('../database');
const User = require('../models/User');

describe('UserRepository', () => {
    beforeAll(async () => {
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    beforeEach(async () => {
        await User.destroy({ where: {}, truncate: true });
    });

    it('Deve criar um usuário com sucesso', async () => {
        const userData = {
            name: 'João Silva',
            userName: 'joaosilva',
            email: 'joao@example.com',
            password: 'password123'
        };
        const result = await UserRepository.create(userData);
        expect(result.userName).toBe(userData.userName);
        expect(result).not.toHaveProperty('password');
    });

    it('Deve encontrar um usuário por e-mail', async () => {
        await User.create({
            name: 'Maria',
            userName: 'maria123',
            email: 'maria@example.com',
            password: 'password123'
        });
        const user = await UserRepository.findByEmail('maria@example.com');
        expect(user.userName).toBe('maria123');
    });

    it('Deve retornar null ao buscar id inexistente', async () => {
        const user = await UserRepository.findById(999);
        expect(user).toBeNull();
    });
});