const GameService = require("../services/GameService");
const gameService = require("../services/GameService");

class GameController {

    /**
     * Cria uma nova partida com os dados fornecidos no corpo da requisição.
     * O criador da partida é identificado pelo ID do usuário autenticado.
     *
     * @async
     * @method create
     * @memberof GameController
     *
     * @returns {Promise<void>}
     * Em caso de sucesso, retorna o status e os dados da partida criada.
     * Em caso de falha, repassa o erro ao middleware de tratamento de erros via `next`.
     *
     * @see GameService.create
     */
    async create(req, res, next) {
        const creatorId = req.userId;   // ID do usuário autenticado (injetado pelo middleware de autenticação)
        const data = req.body           // Dados da partida a ser criada
        const result = await gameService.create(data, creatorId);
        
        if(result.ok) return res.status(result.status).json(result.value);
        next(result)
    }

    async findAll(req, res, next) {
        const result = await gameService.findAll();
        if(result.ok) return res.status(result.status).json(result.value);
        next(result)
    }

    async getById(req, res, next) {
        const result = await gameService.findById(req.params.id);
        if(result.ok) return res.status(result.status).json(result.value);
        next(result)
    }

    async adicionarJogador(req, res, next) {
        const gameId = req.params.id;
        const playerId = req.userId;

        const result = await gameService.adicionarJogador(gameId, playerId);
        if(result.ok) return res.status(result.status).json(result.value);
        next(result)
    }

    async marcarPronto(req, res, next) {
        const gameId = req.params.id;
        const playerId = req.userId || req.body.playerId;
        const result = await gameService.marcarPronto(gameId, playerId);
        if(result.ok) return res.status(result.status).json(result.value);
        next(result)
    }

    async iniciarJogo(req, res, next) {
        const gameId = req.params.id;
        const userId = req.userId || req.body.userId;
        const result = await gameService.iniciarJogo(gameId, userId);
        if(result.ok) return res.status(result.status).json(result.value);
        next(result)
    }

    async finalizarJogo(req, res, next) {
        const gameId = req.params.id;
        const userId = req.userId || req.body.userId;
        const result = await gameService.finalizarJogo(gameId, userId);
        if(result.ok) return res.status(result.status).json(result.value);
        next(result)
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

    /**
     * Controlador HTTP para a ação de descartar uma carta na partida.
     * Extrai os dados da requisição e delega a lógica ao serviço responsável.
     *
     * @async
     * @method jogarUmaCarta
     * @memberof GameController
     *
     * @returns {Promise<void>}
     * Em caso de sucesso, retorna status 200 com a mensagem e os dados da carta descartada.
     * Em caso de falha, repassa o erro ao middleware de tratamento de erros via `next`.
     *
     * @see GameService.jogarUmaCarta
     */
    async jogarUmaCarta(req, res, next){
        const gameId = req.params.id; // ID da partida (extraído da URL)
        const playerId = req.userId;  //  ID do jogador autenticado (injetado pelo middleware de autenticação)
        const {cardId} = req.body;    // ID da carta a ser descartada

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