const express = require("express");
const gameController = require("../controllers/GameController");
const authMiddlewares = require("../middlewares/auth.middleware.js");
const memoizationMiddleware = require("../middlewares/memoizationMiddleware.js");
const router = express.Router();

const memoization = memoizationMiddleware({
    max: 100,
    maxAge: 30000
});

// Rotas básicas CRUD
router.post("/",authMiddlewares, gameController.create);
router.get("/",authMiddlewares, gameController.findAll);
router.get("/:id",authMiddlewares, gameController.getById);
router.put("/:id",authMiddlewares, gameController.update);
router.delete("/:id",authMiddlewares, gameController.delete);

// Novas rotas de gerenciamento de partida
router.post("/:id/join",authMiddlewares, gameController.adicionarJogador);     // Entrar na partida
router.post("/:id/ready",authMiddlewares, gameController.marcarPronto);         // Marcar como pronto
router.post("/:id/start",authMiddlewares, gameController.iniciarJogo);          // Iniciar jogo (criador + todos prontos)
router.post("/:id/finish",authMiddlewares, gameController.finalizarJogo);       // Finalizar jogo (apenas criador)

router.get('/history/:id', memoization, gameController.getHistory);

module.exports = router;