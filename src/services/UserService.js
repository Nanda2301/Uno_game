const UserRepository = require("../repositories/UserRepository");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

class UserService {

    async create(data) {
        if (!data) {
            return { status: 400, message: "Dados não enviados" };
        }

        const { name, userName, email, password } = data;

        if (!name || !userName || !email || !password) {
            return { status: 400, message: "Preencha todos os campos" };
        }

        const emailExists = await UserRepository.emailExist(email);
        if (emailExists) {
            return { status: 409, message: "Email já cadastrado" };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await UserRepository.create({
            name,
            userName,
            email,
            password: hashedPassword
        });

        return { status: 201, user };
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
        if (!email || !password) {
            return { status: 400, message: "Email e senha são obrigatórios" };
        }

        const user = await UserRepository.findByEmail(email);
        if (!user) {
            return { status: 401, message: "Usuário não encontrado" };
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return { status: 401, message: "Senha inválida" };
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        return { status: 200, token };
    }
}

module.exports = new UserService();
