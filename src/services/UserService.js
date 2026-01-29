const UserRepository = require("../repositories/UserRepository");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config(); // Garante que as variáveis de ambiente sejam lidas

class UserService {
    async create(data) {
        return UserRepository.create(data);
    }

    async findById(id) {
        return UserRepository.findById(id);
    }

    async findAll() {
        return UserRepository.findAll();
    }

    async update(id, data) {
        const user = await UserRepository.findById(id);
        if (!user) return null;

        // Atualiza os campos permitidos
        if (data.name) user.name = data.name;
        if (data.age) user.age = data.age;
        if (data.email) user.email = data.email;

        await user.save();
        return user;
    }

    async delete(id) {
        const user = await UserRepository.findById(id);
        if (!user) return null;

        await UserRepository.delete(user);
        return true;
    }

    async login(email, password) {
        const user = await UserRepository.findByEmail(email);

        if (!user) return { status: 401, message: "User not found" };

        // Verifica se a senha veio do banco
        if (!user.password) {
            // Se cair aqui, precisa ajustar o UserRepository.findByEmail para incluir a senha
            return { status: 500, message: "Error: Password definition missing in DB query" };
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) return { status: 401, message: "Invalid password" };

        const secret = process.env.JWT_SECRET || "fallback_secret_dev"; 
        
        const token = jwt.sign(
            { id: user.id, email: user.email }, 
            secret, 
            { expiresIn: "1h" }
        );

        return { status: 200, token: token };
    }
}

module.exports = new UserService();