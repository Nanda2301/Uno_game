// controllers/AuthController.js
const AuthService = require("../services/AuthService");

class AuthController {
  /**
   * Controlador HTTP para o logout do usuário autenticado.
   * Extrai o token JWT do cabeçalho da requisição e delega
   * a invalidação do token ao serviço de autenticação.
   *
   * @async
   * @method logout
   * @memberof AuthController
   *
   * @param {import('express').Request}  req  - Objeto de requisição do Express
   * @param {import('express').Response} res  - Objeto de resposta do Express
   * @param {import('express').NextFunction} next - Função para repasse de erros ao middleware de erros
   *
   * @param {string} req.headers.authorization - Cabeçalho de autorização no formato "Bearer <token>"
   *
   * @returns {Promise<void>}
   * Em caso de sucesso, retorna status 200 com o resultado do logout.
   * Em caso de falha, repassa o erro ao middleware de tratamento de erros via `next`.
   *
   * @see AuthService.logout
   */
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
