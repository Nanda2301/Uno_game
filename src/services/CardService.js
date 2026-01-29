const CardRepository = require("../repositories/CardRepository");

class CardService {

    // LÓGICA DE NEGÓCIO: CRIAR BARALHO (108 cartas)
    async createDeck(gameId) {
        const colors = ['red', 'blue', 'green', 'yellow'];
        const values = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'skip', 'reverse', 'draw2'];
        const wildCards = ['wild', 'wild_draw4'];
        
        const deckData = [];

        colors.forEach(color => {
            values.forEach(value => {
                if (value === '0') {
                    deckData.push({ gameId, color, value });
                } else {
                    deckData.push({ gameId, color, value });
                    deckData.push({ gameId, color, value });
                }
            });
        });

        // Cartas Pretas - 4 de cada tipo
        wildCards.forEach(value => {
            for (let i = 0; i < 4; i++) {
                deckData.push({ gameId, color: 'black', value });
            }
        });

        // Chama o método de criação em massa no repositório
        return await CardRepository.createMany(deckData);
    }

    async create(data) {
        return await CardRepository.create(data);
    }

    async findAll() {
        return await CardRepository.findAll();
    }

    async findById(id) {
        return await CardRepository.findById(id);
    }

    async update(id, data) {
        const card = await CardRepository.findById(id);
        if (!card) return null;

        return await CardRepository.update(card, data);
    }

    async delete(id) {
        const card = await CardRepository.findById(id);
        if (!card) return null;

        await CardRepository.delete(card);
        return true;
    }
}

module.exports = new CardService();