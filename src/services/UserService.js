const UserRepository = require('../repositories/UserRepository');
const Result = require("../config/result")

/**
 * Cria um novo usuário após validar os campos obrigatórios e verificar
 * se o e-mail já está cadastrado.
 *
 * @async
 * @function create
 * @param {Object} data          - Dados do usuário a ser criado
 * @param {string} data.name     - Nome do usuário
 * @param {string} data.userName - Nome de jogador
 * @param {string} data.email    - E-mail do usuário
 * @param {string} data.password - Senha do usuário
 *
 * @returns {Promise<Result>} Result de sucesso com os dados do usuário criado,
 * ou Result de falha nos seguintes cenários:
 * - Campo obrigatório ausente (status 404)
 * - E-mail já cadastrado (status 406)
 * - Erro interno (status 400)
 */
async function create(data) {
    if (!data.password) return Result.fail(new Error("Senha de usuário não informada!"), 400);
    if (!data.userName) return Result.fail(new Error("Nome de jogador não informado!"), 400);
    if (!data.name) return Result.fail(new Error("Nome de usuário não informado!"), 400);
    if (!data.email) return Result.fail(new Error("Email do usuário não informado!"), 400);

    try{
        const emailExist = await UserRepository.emailExist(data.email);
        if (emailExist) return Result.fail(new Error("Email já cadastrado"), 406);

        const user = await UserRepository.create(data);
        return Result.ok(user, 201)
    }catch(error){
        return Result.fail(error)
    }
}

/**
 * Busca um usuário pelo seu ID.
 *
 * @async
 * @function findById
 * @param {number} id - ID do usuário a ser buscado
 * @returns {Promise<Result>} Result de sucesso com os dados do usuário,
 * ou Result de falha com status 404 se não encontrado
 */
async function findById(id) {
    try{
        const user = await UserRepository.findById(id);
        if(user) return Result.of(user);
        return Result.fail("User not found", 404)
    }catch(err){
        return Result.fail(err)
    }
}

/**
 * Atualiza os dados de um usuário existente.
 *
 * @async
 * @function update
 * @param {number} id   - ID do usuário a ser atualizado
 * @param {Object} data - Campos a serem atualizados
 * @returns {Promise<Result>} Result de sucesso com os dados atualizados,
 * ou Result de falha com status 404 se o usuário não for encontrado
 */
async function update(id, data) {
    try{
        const userUpdated = await UserRepository.update(id, data);
        if(userUpdated) return Result.of(userUpdated);
        return Result.fail("User not found", 404)
    }catch(err){
        return Result.fail(err)
    }
}

/**
 * Retorna todos os usuários cadastrados.
 *
 * @async
 * @function findAll
 * @returns {Promise<Result>} Result de sucesso com a lista de usuários,
 * ou Result de falha em caso de erro interno
 */
async function findAll() {
    try{
        const allUsers = await UserRepository.findAll();
        return Result.of(allUsers)
    }catch(err){
        return Result.fail(err)
    }
}

/**
 * Remove um usuário pelo seu ID.
 *
 * @async
 * @function deleteUser
 * @param {number} id - ID do usuário a ser removido
 * @returns {Promise<Result>} Result de sucesso com mensagem de confirmação,
 * ou Result de falha com status 404 se o usuário não for encontrado
 */
async function deleteUser(id) {
    try{
        const userDeleted = await UserRepository.delete(id);
        if(userDeleted) return Result.of("User account was deleted successfully");
        return Result.fail("User not found", 404)
    }catch(err){
        return Result.fail(err)
    }
}

/**
 * Busca um usuário pelo seu e-mail.
 * Utilizado principalmente no processo de autenticação.
 *
 * @async
 * @function findUserByEmail
 * @param {string} email - E-mail do usuário a ser buscado
 * @returns {Promise<Result>} Result de sucesso com os dados do usuário,
 * ou Result de falha com status 404 se não encontrado
 */
async function findUserByEmail(email) {
    try{
        const user = await UserRepository.findByEmail(email);
        if (!user) return Result.fail(new Error("User not found"), 404);
        return Result.of(user)
    }catch(error){
        return Result.fail(error)
    }
}

module.exports = {
    create,
    findById,
    update,
    findAll,
    delete: deleteUser,
    findUserByEmail
};
