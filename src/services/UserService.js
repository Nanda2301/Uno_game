const UserRepository = require("../repositories/UserRepository")

class UserService{
    async create(data){
        return UserRepository.create(data);
    }

    async findById(id){
        return UserRepository.findById(id);
    }

    async fidnAll(){
        return UserRepository.findAll();
    }

    async delete(id){
        const user = await UserRepository.findById(id);
        if(!user) return null;

        await UserRepository.delete(user);
        return true;
    }
}

module.exports = new UserService();