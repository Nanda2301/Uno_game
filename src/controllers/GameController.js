const GameService = require("../services/GameService");
const gameService = require("../services/GameService");

class GameController {
    async create(req, res, next) {
        try {
            const creatorId = req.userId;

            if (!creatorId) {
                return res.status(400).json({
                    error: "Creator ID é obrigatório"
                });
            }

            const game = await gameService.create(req.body, creatorId);
            return res.status(201).json(game);
        } catch (error) {
            next(error);
        }
    }

    async findAll(req, res, next) {
        try {
            const games = await gameService.findAll();
            return res.status(200).json(games);
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

    async adicionarJogador(req, res, next) {
        try {
            const gameId = req.params.id;
            const playerId = req.userId || req.body.playerId;

            if (!playerId) {
                return res.status(400).json({
                    error: "Player ID é obrigatório"
                });
            }

            const resultado = await gameService.adicionarJogador(gameId, playerId);

            if (resultado.error) {
                return res.status(400).json(resultado);
            }

            return res.status(201).json(resultado);
        } catch (error) {
            next(error);
        }
    }

    async marcarPronto(req, res, next) {
        try {
            const gameId = req.params.id;
            const playerId = req.userId || req.body.playerId;

            if (!playerId) {
                return res.status(400).json({
                    error: "Player ID é obrigatório"
                });
            }

            const resultado = await gameService.marcarPronto(gameId, playerId);

            if (resultado.error) {
                return res.status(400).json(resultado);
            }

            return res.status(200).json(resultado);
        } catch (error) {
            next(error);
        }
    }

    async iniciarJogo(req, res, next) {
        try {
            const gameId = req.params.id;
            const userId = req.userId || req.body.userId;

            if (!userId) {
                return res.status(401).json({
                    error: "Usuário não autenticado"
                });
            }

            const resultado = await gameService.iniciarJogo(gameId, userId);

            if (resultado.error) {
                return res.status(403).json(resultado);
            }

            return res.status(200).json(resultado);
        } catch (error) {
            next(error);
        }
    }

    async finalizarJogo(req, res, next) {
        try {
            const gameId = req.params.id;
            const userId = req.userId || req.body.userId;

            if (!userId) {
                return res.status(401).json({
                    error: "Usuário não autenticado"
                });
            }

            const resultado = await gameService.finalizarJogo(gameId, userId);

            if (resultado.error) {
                return res.status(403).json(resultado);
            }

            return res.status(200).json(resultado);
        } catch (error) {
            next(error);
        }
    }

    async getStatus(req, res) {
        try {
            const { id } = req.params;

            const gameStatus = await gameService.getFullStatus(id);

            return res.status(200).json(gameStatus);
        } catch (error) {
            return res.status(400).json({
                message: error.message
            });
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

    async getHistory(req, res) {
        const gameId = req.params.id;

        const history = gameService.getHistory(gameId);

        return res.status(200).json(history);
    }

    /**
     * 
     * @param {number} req 
     * @param {number} res 
     * @param {number} next 
     * @returns 
     */
    async seePlayerHand(req, res, next){
        const gameId = req.params.id;
        const playerId = req.userId

        try{
            const result = await GameService.seePlayerHand(gameId, playerId)
            return res.status(200).json({"player cards": result})
        }catch(error){
            next(error)
        }
    }

    async jogarUmaCarta(req, res, next){
        const gameId = req.params.id;
        const playerId = req.userId;
        const {cardId} = req.body;

        const result = await GameService.jogarUmaCarta(gameId, playerId, cardId);
        if(result.ok) return res.status(result.status).json({message: "Jogador jogou a carta com sucesso", data: result.value});
        return next(result.error)
    }

    async obterRanking(req, res, next) {
        try {
            const gameId = req.params.id;

            const ranking = await gameService.obterRankingPartida(gameId);

            return res.status(200).json(ranking);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new GameController();