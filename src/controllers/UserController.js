const userService = require("../services/UserService.js");

/**
 * Controlador HTTP responsável pelas operações de usuários.
 * Delega a lógica de negócio ao `UserService` e gerencia
 * as respostas HTTP e o repasse de erros.
 *
 * @class UserController
 */
class UserController {

    /**
     * Cria um novo usuário com os dados fornecidos no corpo da requisição.
     *
     * @async
     * @method create
     * @param {Object} req.body - Dados do usuário a ser criado
     * @returns {Promise<void>} Status 200 com os dados do usuário criado, ou repassa o erro via `next`
     */
    async create(req, res, next) {
        const result = await userService.create(req.body);
        if(result.ok) return res.status(result.status).json(result.value);
        next(result)
    }

    /**
     * Retorna um usuário pelo seu ID.
     *
     * @async
     * @method getById
     * @param {number} req.params.id - ID do usuário a ser buscado
     * @returns {Promise<void>} Status 200 com os dados do usuário, ou repassa o erro via `next`
     */
    async getById(req, res, next) {
        const result = await userService.findById(req.params.id);
        if(result.ok) return res.status(result.status).json(result.value);
        next(result)
    }

    /**
     * Atualiza os dados do usuário autenticado.
     *
     * @async
     * @method update
     * @param {number} req.userId - ID do usuário autenticado (injetado pelo middleware de autenticação)
     * @param {Object} req.body   - Campos a serem atualizados
     * @returns {Promise<void>} Status 200 com os dados atualizados, ou repassa o erro via `next`
     */
    async update(req, res, next) {
        const result = await userService.update(req.userId, req.body);
        if(result.ok) return res.status(result.status).json(result.value);
        next(result)
    }

    /**
     * Retorna todos os usuários cadastrados.
     *
     * @async
     * @method findAll     *
     * @returns {Promise<void>} Status 200 com a lista de usuários, ou repassa o erro via `next`
     */
    async findAll(req, res, next) {
        const result = await userService.findAll();
        console.log(`consult`, result)
        if(result.ok) return res.status(result.status).json(result.value);
        next(result)
    }

    /**
     * Remove um usuário pelo seu ID.
     *
     * @async
     * @method delete
     * @param {number} req.params.id - ID do usuário a ser removido
     * @returns {Promise<void>} Status 200 com a confirmação da remoção, ou repassa o erro via `next`
     */
    async delete(req, res, next) {
        const result = await userService.delete(req.params.id);
        if(result.ok) return res.status(result.status).json(result.value);
        next(result)
    }

    /**
     * Retorna os dados do próprio usuário autenticado.
     *
     * @async
     * @method aboutMe
     * @param {number} req.userId - ID do usuário autenticado (injetado pelo middleware de autenticação)
     * @returns {Promise<void>} Status 200 com os dados do usuário autenticado, ou repassa o erro via `next`
     */
    async aboutMe(req, res, next){
        const result = await userService.findById(req.userId);
        if(result.ok) return res.status(result.status).json(result.value);
        next(result)
    }
}

module.exports = new UserController();
