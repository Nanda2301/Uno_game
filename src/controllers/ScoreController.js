const scoreService = require("../services/ScoreService");

class ScoreController {
    async create(req, res, next) {
            const score = await scoreService.create(req.body);
            if(score.ok) return res.status(score.status).json(score.value);
            next(score)
    }

    async findAll(req, res, next) {
        const scores = await scoreService.findAll();
        if(scores.ok) return res.status(scores.status).json(scores.value);
        next(scores)
    }

    async getById(req, res, next) {
        const score = await scoreService.findById(req.params.id);
        if(score.ok) return res.status(score.status).json(score.value);
        next(score)
    }

    /**
     * GET /scores/ranking - Ranking geral
     */
    async obterRanking(req, res, next) {
        const ranking = await scoreService.obterRankingGeral();
        if(ranking.ok) return res.status(ranking.status).json(ranking.value);
        next(ranking)
    }

    /**
     * GET /scores/top10 - Top 10 jogadores
     */
    async obterTop10(req, res, next) {
        const top10 = await scoreService.obterTop10();
        if(top10) return res.status(top10.status).json(top10.value);
        next(top10);
    }

    /**
     * GET /scores/player/:playerId - Estatísticas de jogador
     */
    async obterEstatisticasJogador(req, res, next) {
        const playerId = parseInt(req.params.playerId);
        const stats = await scoreService.obterEstatisticasJogador(playerId);
        if(stats.ok) return res.status(stats.status).json(stats.value);
        next(stats);
    }

    async delete(req, res, next) {
        const deleted = await scoreService.delete(req.params.id);
        if(deleted.ok) return res.status(deleted.status).json(deleted.value);
        next(deleted)
    }
}

module.exports = new ScoreController();