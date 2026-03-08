const express = require("express");
const gameController = require("../controllers/GameController");
const authMiddleware = require("../middlewares/auth.middleware.js");

const router = express.Router();

router.post("/", authMiddleware, gameController.create);
router.get("/", authMiddleware, gameController.findAll);
router.get("/:id", authMiddleware, gameController.getById);
router.put("/:id", authMiddleware, gameController.update);
router.delete("/:id", authMiddleware, gameController.delete);

router.post("/:id/join", authMiddleware, gameController.adicionarJogador);
router.post("/:id/ready", authMiddleware, gameController.marcarPronto);
router.post("/:id/start", authMiddleware, gameController.iniciarJogo);
router.post("/:id/finish", authMiddleware, gameController.finalizarJogo);
router.post("/:id/play", authMiddleware, gameController.jogarUmaCarta);
router.post("/:id/comprar", authMiddleware, gameController.comprarSeNaoPuderJogar);
router.post("/:id/leave", authMiddleware, gameController.abandonarjogo);

router.get("/:id/myhand", authMiddleware, gameController.seePlayerHand);
router.get("/:id/history", authMiddleware, gameController.getHistory);
router.get("/:id/ranking", authMiddleware, gameController.obterRanking);
router.get("/:id/state", authMiddleware, gameController.getEstadoAtual);

module.exports = router;