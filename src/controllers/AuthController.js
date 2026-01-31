// controllers/AuthController.js
const AuthService = require("../services/AuthService");

class AuthController {
  async logout(req, res, next) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const result = await AuthService.logout(token);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
