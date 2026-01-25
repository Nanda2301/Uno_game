const Score = require("../models/Score");

class ScoreRepository {
    async create(data) {
        return await Score.create(data);
    }

    async findAll() {
        return await Score.findAll();
    }

    async findById(id) {
        return await Score.findByPk(id);
    }

    async update(scoreInstance, data) {
        return await scoreInstance.update(data);
    }

    async delete(scoreInstance) {
        return await scoreInstance.destroy();
    }
}

module.exports = new ScoreRepository();