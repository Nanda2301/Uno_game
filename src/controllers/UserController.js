const userService = require("../services/UserService.js");

class UserController{
    async create(req, res, next){
        try {
            const result = await userService.create(req.body);

            if(result.error){
                res.status(400).json(result);
            }
            
            res.status(201).json(result);
        } catch(error){
            next(error);
        }
    }

    async getById(req, res, next){
        try {
            const user = await userService.findById(req.params.id);
            if(!user){
                return res.status(404).json({error: "User not found"});
            }
            return res.status(200).json(user);
        } catch (error){
            next(error);
        }
    }

    async findAll(req, res, next){
        try {
            const user = await userService.findAll();
            if(!user){
                return res.status(404).json({error: "User not found"});
            }
            return res.status(200).json(user);
        } catch (error){
            next(error);
        }
    }

    async delete(req, res, next){
        try {
            const deleted = await userService.delete(req.params.id);
            if(!deleted){
                return res.status(404).json({error: "User not found"});
            }
            return res.status(204).send();
        } catch (error){
            next(error)
        }
    }

    async login(req, res, next){
        try{
            const {password, email} = req.body
            console.log(password)
            const {status, ...rest} = await userService.login(email, password)
            return res.status(status).json(rest)

        }catch(error){
            next(error)
        }
    }
}

module.exports = new UserController();