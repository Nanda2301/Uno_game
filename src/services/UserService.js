const UserRepository = require("../repositories/UserRepository")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

class UserService{
    async create(data){
        // Validations
        if(data === undefined) {
            return { message: "Tem que enviar dados", error: true }
        }

        if(!data.name){
            return { message: "Tem que enviar o nome", error: true }
        }

        if(!data.password) {
            return { message: "Tem que enviar o password", error: true }
        }

        if(!data.email) {
            return { message: "Tem que enviar o email", error: true }
        }

        if(await UserRepository.emailExist(data.email)) {
            return { message: "Não pode repetir o email de outro usuario", error: true }
        }

        // If validation failure
        // return error

        // If validation pass
        const user = await UserRepository.create(data)

        return {...user, error: false };
    }

    async findById(id){
        return UserRepository.findById(id);
    }

    async findAll(){
        return UserRepository.findAll();
    }

    async delete(id){
        const user = await UserRepository.findById(id);
        if(!user) return null;

        await UserRepository.delete(user);
        return true;
    }

    async login(email, password){
        const user = await UserRepository.findByEmail(email)
        console.log(user)
        if(!user) return {status: 401, message: "User not found"}
        const passwordMatch = await bcrypt.compare(password, user.password)
        if(!passwordMatch) return {status: 401, message: "Invalid password"}

        const token = jwt.sign({id: user.id, email: user.email}, "CHAVEULTRASECRETA", {expiresIn: "1h"})
        return {status: 200, token: token}
    }
}

module.exports = new UserService();