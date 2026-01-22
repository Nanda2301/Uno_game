const CardRepository = require("../repositories/CardRepository");

class CardService {
    async create(data) {
        // Poderia adicionar validações aqui (ex: checar formato do CPF, data, etc)
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