const UserRepository = require('../repositories/UserRepository');
const Result = require("../config/result")

async function create(data) {
    if (!data.password) return Result.fail(new Error("Senha de usuário não informada!"), 404);
    if (!data.userName) return Result.fail(new Error("Nome de jogador não informado!"), 404);
    if (!data.name) return Result.fail(new Error("Nome de usuário não informado!"), 404);
    if (!data.email) return Result.fail(new Error("Email do usuário não informado!"), 404);

    try{
        const emailExist = await UserRepository.emailExist(data.email);
        if (emailExist) return Result.fail(new Error("Email do usuário não informado!"), 406);

        const user = await UserRepository.create(data);
        return Result.of(user)
    }catch(error){
        return Result.fail(error)
    }
}

async function findById(id) {
    return await UserRepository.findById(id);
}

async function update(id, data) {
    return await UserRepository.update(id, data);
}

async function findAll() {
    return await UserRepository.findAll();
}

async function deleteUser(id) {
    return await UserRepository.delete(id);
}

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
