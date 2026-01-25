const ScoreRepository = require("../repositories/ScoreRepository");

class ScoreService {
    async create(data) {
        // Aqui você poderia validar se o player e o game existem antes de criar
        return await ScoreRepository.create(data);
    }

    async findAll() {
        return await ScoreRepository.findAll();
    }

    async findById(id) {
        return await ScoreRepository.findById(id);
    }

    async update(id, data) {
        const score = await ScoreRepository.findById(id);
        if (!score) return null;

        return await ScoreRepository.update(score, data);
    }

    async delete(id) {
        const score = await ScoreRepository.findById(id);
        if (!score) return null;

        await ScoreRepository.delete(score);
        return true;
    }
}

module.exports = new ScoreService();