const cardService = require("../services/CardService");

class CardController {
    async create(req, res, next) {
        try {
            const card = await cardService.create(req.body);
            res.status(201).json(card);
        } catch (error) {
            next(error);
        }
    }

    async findAll(req, res, next) {
        try {
            const cards = await cardService.findAll();
            res.status(200).json(cards);
        } catch (error) {
            next(error);
        }
    }

    async getById(req, res, next) {
        try {
            const card = await cardService.findById(req.params.id);
            if (!card) {
                return res.status(404).json({ error: "Card not found" });
            }
            res.status(200).json(card);
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const updatedCard = await cardService.update(req.params.id, req.body);
            if (!updatedCard) {
                return res.status(404).json({ error: "Card not found" });
            }
            res.status(200).json(updatedCard);
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            const deleted = await cardService.delete(req.params.id);
            if (!deleted) {
                return res.status(404).json({ error: "Card not found" });
            }
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new CardController();