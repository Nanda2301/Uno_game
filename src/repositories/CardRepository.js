const Card = require("../models/Card");

class CardRepository {
    async create(data) {
        return await Card.create(data);
    }

    async findAll(options={}) {
        return await Card.findAll(options);
    }

    /**
     * Busca uma carta pelo seu identificador primário.
     *
     * @async
     * @method findById
     *
     * @param {number}  id       - ID da carta a ser buscada
     * @param {boolean} [raw=true] - Se `true`, retorna um objeto JavaScript simples.
     *                               Se `false`, retorna uma instância do modelo Sequelize
     *
     * @returns {Promise<Card|null>} Retorna a carta encontrada,
     * ou `null` se nenhuma carta corresponder ao ID fornecido
     */
    async findById(id, raw=true) {
        return await Card.findByPk(id, {raw});
    }

    /**
     * Atualiza os dados de uma carta existente no banco de dados.
     * Apenas os campos presentes em `data` serão modificados,
     * mantendo os demais valores inalterados.
     *
     * @async
     * @method update
     *
     * @param {number} id - ID da carta a ser atualizada
     * @param {Object} data - Campos a serem atualizados
     * @param {string} [data.color]    - Nova cor da carta
     * @param {string} [data.value]    - Novo valor da carta
     * @param {number} [data.gameId]   - Novo ID do jogo associado
     * @param {number} [data.playerId] - Novo ID do jogador associado
     * @param {string} [data.pile]     - Nova pilha onde a carta se encontra
     * @param {Object} [options={}]    - Opções adicionais repassadas ao método `save()` do Sequelize
     *                                   (ex: `{ transaction }` para controle transacional)
     *
     * @returns {Promise<Card|null>} Retorna a instância atualizada da carta,
     * ou `null` se nenhuma carta for encontrada com o ID fornecido
     */
    async update(id, data, options = {}) {
        const card = await Card.findByPk(id);
        if (!card) return null;

        if ("color" in data) card.color = data.color;
        if ("value" in data) card.value = data.value;
        if ("gameId" in data) card.gameId = data.gameId;
        if ("playerId" in data) card.playerId = data.playerId;
        if ("pile" in data) card.pile = data.pile;

        await card.save(options);
        return card.get({ plain: true });
    }

    async createMany(cardsData) {
        // bulkCreate insere um array de objetos de uma só vez no banco
        return await Card.bulkCreate(cardsData);
    }

    async delete(cardOrId) {
        let card = null;

        if (cardOrId && typeof cardOrId.destroy === "function") {
        card = cardOrId;
        } else {
        const id = typeof cardOrId === "object" ? cardOrId?.id : cardOrId;
        card = await Card.findByPk(id);
        }

        if (!card) return null;

        await card.destroy();
        return true;
    }

    async findOne(options){
        return await Card.findOne(options)
    }
}

module.exports = new CardRepository();