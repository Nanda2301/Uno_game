const UserRepository = require('../repositories/UserRepository');
const jwt = require('jsonwebtoken');

async function create(data) {

    if (!data.password) {
        return { error: true, message: "Tem que enviar o password" };
    }

    if (!data.userName) {
        return { error: true, message: "Tem que enviar o nome de usuário" };
    }

    if (!data.name || !data.email) {
        return { error: true, message: "Preencha todos os campos" };
    }

    const emailExist = await UserRepository.emailExist(data.email);

    if (emailExist) {
        return { error: true, message: "Não pode repetir o email" };
    }

    const user = await UserRepository.create(data);

    return {
        error: false,
        ...user
    };
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

async function login(email, password) {

    const user = await UserRepository.findByEmail(email);

    if (!user || user.password !== password) {
        return { status: 401, message: "Credenciais inválidas" };
    }

    const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET || "secret",
        { expiresIn: "1h" }
    );

    return {
        status: 200,
        token
    };
}

module.exports = {
    create,
    findById,
    update,
    findAll,
    delete: deleteUser,
    login
};
