const Card = require("../models/Card");

class CardRepository {
    async create(data) {
        return await Card.create(data);
    }

    async findAll(options={}) {
        return await Card.findAll(options);
    }

    async findById(id) {
        return await Card.findByPk(id);
    }

    async update(id, data) {
        
        const card = await this.findById(id)
        if(data.color) card.color = data.color;
        if(data.value) card.value = data.value;
        if(data.gameId) card.gameId = data.gameId
        await card.save()
        return card

    }

    async createMany(cardsData) {
        // bulkCreate insere um array de objetos de uma só vez no banco
        return await Card.bulkCreate(cardsData);
    }

    async delete(card) {
        return await card.destroy();
    }

    async findOne(options){
        return await Card.findOne(options)
    }
}

module.exports = new CardRepository();