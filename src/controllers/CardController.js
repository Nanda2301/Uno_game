const cardService = require("../services/CardService");

class CardController {
    async create(req, res, next) {
        try {
            const card = await cardService.create(req.body);
            return res.status(201).json(card);
        } catch (error) {
            next(error);
        }
    }

    async findAll(req, res, next) {
        try {
            const cards = await cardService.findAll();
            return res.status(200).json(cards);
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

            return res.status(200).json(card);
        } catch (error) {
            next(error);
        }
    }

    async getMyCards(req, res, next) {
        try {
            const playerId = req.user.id;
            const playerName = req.user.name;

            const hand = await cardService.getPlayerHand(playerId);

            return res.status(200).json({
                player: playerName,
                hand
            });
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const updatedCard = await cardService.update(
                req.params.id,
                req.body
            );

            if (!updatedCard) {
                return res.status(404).json({ error: "Card not found" });
            }

            return res.status(200).json(updatedCard);
        } catch (error) {
            next(error);
        }
    }
    async deal(req, res, next) {
    try {
        const { gameId, players, cardsPerPlayer } = req.body;

        const resultado = await cardService.dealCards(
            gameId,
            players,
            cardsPerPlayer
        );

        res.status(200).json({
            message: "Cards dealt successfully.",
            players: resultado
        });

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

            return res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}



module.exports = new CardController();