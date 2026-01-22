const gameService = require("../services/GameService");

class GameController {
    async create(req, res, next) {
        try {
            const game = await gameService.create(req.body);
            res.status(201).json(game);
        } catch (error) {
            next(error);
        }
    }

    async findAll(req, res, next) {
        try {
            const games = await gameService.findAll();
            res.status(200).json(games);
        } catch (error) {
            next(error);
        }
    }

    async getById(req, res, next) {
        try {
            const game = await gameService.findById(req.params.id);
            if (!game) {
                return res.status(404).json({ error: "Game not found" });
            }
            return res.status(200).json(game);
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const updatedGame = await gameService.update(req.params.id, req.body);
            if (!updatedGame) {
                return res.status(404).json({ error: "Game not found" });
            }
            return res.status(200).json(updatedGame);
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            const deleted = await gameService.delete(req.params.id);
            if (!deleted) {
                return res.status(404).json({ error: "Game not found" });
            }
            return res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new GameController();