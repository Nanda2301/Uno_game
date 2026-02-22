const User = require("../models/User");
const TokenBlacklist = require("../models/TokenBlacklist");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class AuthService {
  async login(email, password) {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    const senhaValida = await bcrypt.compare(password, user.password);
    if (!senhaValida) {
      throw new Error("Senha inválida");
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      "secret",
      { expiresIn: "1h" }
    );

    return { token };
  }

  async logout(token) {
    await TokenBlacklist.create({ token });
    return { message: "Logout realizado com sucesso" };
  }
}

module.exports = new AuthService();
