const userService = require("../services/UserService.js");

class UserController {
    
    async create(req, res, next) {
        try {
            const user = await userService.create(req.body);
            res.status(201).json(user);
        } catch (error) {
            next(error);
        }
    }

    async getById(req, res, next) {
        try {
            const user = await userService.findById(req.params.id);
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            return res.status(200).json(user);
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const { id } = req.params;
            const { name, age, email } = req.body;
            // Chama o service em vez de chamar o Repository ou Model direto
            const updatedUser = await userService.update(id, { name, age, email });

            if (!updatedUser) {
                return res.status(404).json({ message: "User not found" });
            }

            return res.status(200).json(updatedUser);
        } catch (error) {
            next(error);
        }
    }

    async findAll(req, res, next) {
        try {
            const users = await userService.findAll();
            if (!users) {
                return res.status(404).json({ error: "Users not found" });
            }
            return res.status(200).json(users);
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            const deleted = await userService.delete(req.params.id);
            if (!deleted) {
                return res.status(404).json({ error: "User not found" });
            }
            return res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    async login(req, res, next) {
        try {
            const { password, email } = req.body;

            const { status, ...rest } = await userService.login(email, password);
            return res.status(status).json(rest);

        } catch (error) {
            next(error);
        }
    }
}

module.exports = new UserController();