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
        const result = await gameService.update(req.params.id, req.body);
        if(result.ok) return res.status(result.status).json(result.value);
        next(result)
    }

    async delete(req, res, next) {
        const result = await gameService.delete(req.params.id);
        if(result.ok) return res.status(result.status).json(result.value);
        next(result)
    }

    async getHistory(req, res, next) {
        const gameId = req.params.id;
        const result = await gameService.getHistory(gameId);
        if(result.ok) return res.status(result.status).json(result.value);
        next(result)
    }

    async seePlayerHand(req, res, next){
        const gameId = req.params.id;
        const playerId = req.userId
        const result = await GameService.seePlayerHand(gameId, playerId)
        if(result.ok) return res.status(result.status).json(result.value);
        next(result)
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
        const gameId = req.params.id;
        const result = await gameService.obterRankingPartida(gameId);
        if(result.ok) return res.status(result.status).json(result.value);
        next(result)
    }
}

module.exports = new GameController();