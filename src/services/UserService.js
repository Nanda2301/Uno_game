const UserRepository = require('../repositories/UserRepository');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");

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

    if (!user) return { status: 401, message: "User not found" };

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return { status: 401, message: "Invalid password" };

    const secret = process.env.JWT_SECRET || "fallback_secret_dev";

    const token = jwt.sign(
        { id: user.id, email: user.email },
        secret,
        { expiresIn: "1h" }
    );

    return { status: 200, token };
}

module.exports = {
    create,
    findById,
    update,
    findAll,
    delete: deleteUser,
    login
};
