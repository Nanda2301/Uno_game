const cardService = require("../services/CardService");

/**
 * Controlador HTTP responsável pelas operações CRUD de cartas.
 * Delega a lógica de negócio ao `CardService` e gerencia
 * as respostas HTTP e o repasse de erros.
 *
 * @class CardController
 */
class CardController {

    /**
     * Cria uma nova carta com os dados fornecidos no corpo da requisição.
     *
     * @async
     * @method create
     * @param {Object} req.body - Dados da carta a ser criada
     * @param {import('express').Request}  req          - Objeto de requisição do Express
     * @param {import('express').Response} res          - Objeto de resposta do Express
     * @param {import('express').NextFunction} next     - Função para repasse de erros
     * 
     * @returns {Promise<void>} Status 200 com os dados da carta criada, ou repassa o erro via `next`
     */
    async create(req, res, next) {
        const result = await cardService.create(req.body);
        if(result.ok) return res.status(result.status).json(result.value);
        console.log(result.error)
        next(result)
    }

    /**
     * Retorna todas as cartas cadastradas.
     *
     * @async
     * @method findAll
     * @returns {Promise<void>} Status 200 com a lista de cartas, ou repassa o erro via `next`
     */
    async findAll(req, res, next) {
        const result = await cardService.findAll();
        if(result.ok) return res.status(result.status).json(result.value);
        next(result)
    }

    /**
     * Retorna uma carta pelo seu ID.
     *
     * @async
     * @method getById
     * @param {number} req.params.id - ID da carta a ser buscada
     * @returns {Promise<void>} Status 200 com os dados da carta, ou repassa o erro via `next`
     */
    async getById(req, res, next) {
        const result = await cardService.findById(req.params.id);
        if(result.ok) return res.status(result.status).json(result.value);
        next(result)
    }

    /**
     * Atualiza os dados de uma carta existente.
     *
     * @async
     * @method update
     * @param {number} req.params.id - ID da carta a ser atualizada
     * @param {Object} req.body      - Campos a serem atualizados
     * @returns {Promise<void>} Status 200 com os dados atualizados, ou repassa o erro via `next`
     */
    async update(req, res, next) {
        const result = await cardService.update(
                req.params.id,
                req.body
        );
        if(result.ok) return res.status(result.status).json(result.value);
        next(result)
    }

    /**
     * Remove uma carta pelo ID correspondente.
     *
     * @async
     * @method delete
     * @param {number} req.params.id - ID da carta a ser removida
     *
     * @returns {Promise<void>} Status 200 com a confirmação da remoção, ou repassa o erro via `next`
     */
    async delete(req, res, next) {
        const deleted = await cardService.delete(req.params.id);
        if(result.ok) return res.status(result.status).json(result.value);
        next(result)
    }
}



module.exports = new CardController();