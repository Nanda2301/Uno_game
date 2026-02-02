const UserRepository = require("../repositories/UserRepository");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

class UserService {
    async create(data) {
        if (data === undefined) {
            return { message: "Tem que enviar dados", error: true };
        }

        if (!data.name) {
            return { message: "Tem que enviar o nome", error: true };
        }

        if (!data.userName) {
            return { message: "Tem que enviar o nome de usuário", error: true };
        }

        if (!data.password) {
            return { message: "Tem que enviar o password", error: true };
        }

        if (!data.email) {
            return { message: "Tem que enviar o email", error: true };
        }

        if (await UserRepository.emailExist(data.email)) {
            return { message: "Não pode repetir o email de outro usuario", error: true };
        }

        const user = await UserRepository.create(data);
        return { ...user, error: false };
    }

    async findById(id) {
        return UserRepository.findById(id);
    }

    async findAll() {
        return UserRepository.findAll();
    }

    async update(id, data) {
        return UserRepository.update(id, data);
    }

    async delete(id) {
        return UserRepository.delete(id);
    }

    async login(email, password) {
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
}

module.exports = new UserService();
