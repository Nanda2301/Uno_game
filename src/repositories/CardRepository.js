const Card = require("../models/Card");

class CardRepository {
    async create(data) {
        return await Card.create(data);
    }

    async findAll() {
        return await Card.findAll();
    }

    async findById(id) {
        return await Card.findByPk(id);
    }

    async update(card, data) {
        return await card.update(data);
    }

    async createMany(cardsData) {
        // bulkCreate insere um array de objetos de uma só vez no banco
        return await Card.bulkCreate(cardsData);
    }

    async delete(card) {
        return await card.destroy();
    }
}

module.exports = new CardRepository();