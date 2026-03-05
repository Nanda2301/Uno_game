const CardRepository = require('../repositories/CardRepository');
const Card = require('../models/Card');
const sequelize = require('../database');

describe('CardRepository', () => {
    beforeAll(async () => {
        await sequelize.sync({ force: true });
    });

    it('Deve deletar uma carta', async () => {
        const card = await Card.create({ color: 'green', value: 'Skip', gameId: 1 });
        
        // Verifique se o seu repository.delete espera o ID ou a INSTÂNCIA.
        // Baseado no erro, ele tenta fazer card.destroy(), então passamos a instância:
        await CardRepository.delete(card); 
        
        const found = await Card.findByPk(card.id);
        expect(found).toBeNull();
    });
});