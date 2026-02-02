const user = require("../models/User.js");

class UserRepository{
    async create(data){
        const newUser = await user.create(data)
        return {
            name: newUser.name,
            email: newUser.email
        }
    } 
    
    async findById(id){
        const result =  (await user.findByPk(id)).get({plain: true})
        if(result){
            return {
                name: result.name,
                email: result.email,
                createdAt: result.createdAt,
                updatedAt: result.updatedAt,
            }
        }
        return {}
    }

    async findByEmail(email){
        return await user.findOne({where: {email: email},
        attributes: { include: ['password'] } // Força o retorno da senha para comparação
        });
    }

    async findAll(){
        const users = await user.findAll();
        return users.map(x => ({
            name: x.name,
            email: x.email,
            createdAt: x.createdAt,
            updatedAt: x.updatedAt,
        }))
    }

    async delete(user){
        return await user.destroy()
    }

    async emailExist(email) {
        const user = await this.findByEmail(email);
        return user !== null
    }
}

module.exports = new UserRepository();