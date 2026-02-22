const express = require("express");
const gameController = require("../controllers/GameController");
const authMiddlewares = require("../middlewares/auth.middleware.js");
const router = express.Router();

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

router.get('/:id/history',authMiddlewares, gameController.getHistory);
router.get('/:id/ranking', gameController.obterRanking);

module.exports = router;