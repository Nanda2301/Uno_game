const express = require("express");
const gameController = require("../controllers/GameController");
const router = express.Router();

// Rotas básicas CRUD
router.post("/", gameController.create);
router.get("/", gameController.findAll);
router.get("/:id", gameController.getById);
router.put("/:id", gameController.update);
router.delete("/:id", gameController.delete);

// Novas rotas de gerenciamento de partida
router.post("/:id/join", gameController.adicionarJogador);     // Entrar na partida
router.post("/:id/ready", gameController.marcarPronto);         // Marcar como pronto
router.post("/:id/start", gameController.iniciarJogo);          // Iniciar jogo (criador + todos prontos)
router.post("/:id/finish", gameController.finalizarJogo);       // Finalizar jogo (apenas criador)

module.exports = router;