const user = require("../models/User.js");

class UserRepository{
    async create(data){
        const newUser = await user.create(data)
        console.log(newUser)
        return {
            name: newUser.name,
            userName: newUser.userName,
            email: newUser.email
        }
    } 
    
    async findById(id){
        const result =  await user.findByPk(id, {raw: true})
        return result
        
    }

    async findByEmail(email){
        return await user.findOne({
            where: {email: email},
            attributes: { include: ['password'] }, // Força o retorno da senha para comparação
            raw: true
        });
    }

    async findAll(){
        const users = await user.findAll();
        return users.map(x => ({
            name: x.name,
            userName: x.userName,
            email: x.email,
            createdAt: x.createdAt,
            updatedAt: x.updatedAt,
        }))
    }

    async update(id, data){
        const userToUpdate =  (await user.findByPk(id))
        if(!userToUpdate){
            return null
        }
        await userToUpdate.update(data)
        return  {
                  name: userToUpdate.name,
                  email: userToUpdate.email
    }           }   

    async delete(id){
        const userToDelete =  (await user.findByPk(id))
        if(!userToDelete){
            return null
        }
        await userToDelete.destroy()
        return true

    }

    async emailExist(email) {
        const user = await this.findByEmail(email);
        return user !== null
    }
}

module.exports = new UserRepository();