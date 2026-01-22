const UserRepository = require("../repositories/UserRepository")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

class UserService{
    async create(data){
        return UserRepository.create(data);
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