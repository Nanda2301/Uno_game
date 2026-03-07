const {findUserByEmail} = require("./UserService")
const TokenBlacklist = require("../models/TokenBlacklist");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Result = require("../config/result")


class AuthService {
  async login(email, password) {
    try{

      if(!email || !password) return Result.fail("E-mail e senha são obrigatórios", 400)

      const result = await findUserByEmail(email);
      if(!result.ok) return result

      const user = result.value
      const senhaValida = await bcrypt.compare(password, user.password);
      if (!senhaValida) return Result.fail(new Error("Senha inválida"), 401)

      const secret = process.env.JWT_SECRET || "fallback_secret_dev";
      const token = jwt.sign(
        { id: user.id, email: user.email },
        secret,
        { expiresIn: "1h" }
      );

      return Result.of(token)
    }catch(err){
      return Result.fail(err, 500)
    }
  }

  async logout(token) {
    try{
      if(!token) return Result.fail("Token não informado", 400);
      await TokenBlacklist.create({token})
      return Result.of({ message: "Logout realizado com sucesso" });
    }catch(err){
      return Result.fail(error, 500);
    }
  }
}

module.exports = new AuthService();
