// services/AuthService.js
const TokenBlacklist = require("../models/TokenBlacklist");

class AuthService {
  async logout(token) {
    await TokenBlacklist.create({ token });
    return { message: "Logout realizado com sucesso" };
  }
}

module.exports = new AuthService();
