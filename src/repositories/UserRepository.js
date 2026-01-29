const user = require("../models/User.js");

class UserRepository{
    async create(data){
        return await user.create(data)
    } 
    
    async findById(id){
        return await user.findByPk(id)
    }

    async findByEmail(email){
        return await user.findOne({where: {email: email},
        attributes: { include: ['password'] } // Força o retorno da senha para comparação
        });
    }

    async findAll(){
        return user.findAll();
    }

    async delete(user){
        return await user.destroy()
    }
}

module.exports = new UserRepository();