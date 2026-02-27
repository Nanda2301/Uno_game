const scoreService = require("../services/ScoreService");

class ScoreController {
    async create(req, res, next) {
            const score = await scoreService.create(req.body);
            if(score.ok) return res.status(score.status).json(score.value);
    }

    async findAll(req, res, next) {
        try {
            const scores = await scoreService.findAll();
            res.status(200).json(scores);
        } catch (error) {
            next(error);
        }
    }

    async getById(req, res, next) {
        try {
            const score = await scoreService.findById(req.params.id);
            if (!score) {
                return res.status(404).json({ error: "Score not found" });
            }
            res.status(200).json(score);
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /scores/ranking - Ranking geral
     */
    async obterRanking(req, res, next) {
        try {
            const ranking = await scoreService.obterRankingGeral();
            res.status(200).json(ranking);
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /scores/top10 - Top 10 jogadores
     */
    async obterTop10(req, res, next) {
        try {
            const top10 = await scoreService.obterTop10();
            res.status(200).json(top10);
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /scores/player/:playerId - Estatísticas de jogador
     */
    async obterEstatisticasJogador(req, res, next) {
        try {
            const playerId = parseInt(req.params.playerId);
            const stats = await scoreService.obterEstatisticasJogador(playerId);
            res.status(200).json(stats);
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            const deleted = await scoreService.delete(req.params.id);
            if (!deleted) {
                return res.status(404).json({ error: "Score not found" });
            }
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ScoreController();